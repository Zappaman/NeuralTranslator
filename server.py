from configs.fusion_auth_vars import *
from configs.frontend_vars import *
from configs.server_vars import *
from datetime import timedelta
import json
from flask import Flask, request, send_from_directory, abort, session, redirect, url_for
from flask_session import Session
from flask_cors import CORS
from flask_pymongo import PyMongo
from fusionauth.fusionauth_client import FusionAuthClient

from redis import Redis
import rq

from model.translator import TranslatorSrt

import os

from server_utils.tasks import paragraph_translation_task, file_translation_task
from werkzeug.utils import secure_filename

app = Flask(__name__)

# config related
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = True
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(hours=5)
app.config["MONGO_URI"] = SERVER_DB_URI
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["TRANSLATE_FOLDER"] = TRANSLATE_FOLDER

# app wrappers
mongo = PyMongo(app)
Session(app)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
app.secret_key = "super secret key"

# Auth server related
fusionAuthServer = FusionAuthClient(api_key, fusionauth_address)

redis_con = Redis()

# Eager loading of translator module
translator = TranslatorSrt()


@app.route("/job_status/<job_id>")
def get_job_status(job_id):
    job = rq.Queue(connection=redis_con).fetch_job(job_id)
    response = {"status": "unknown"}
    if job:
        response = {
            "status": job.get_status(),
            "result": job.result,
        }
        if job.is_failed:
            response["message"] = job.exc_info.strip().split("\n")[-1]

    return json.dumps(response)


@app.route("/job_done", methods=["GET", "POST"])
def job_done():
    doc = request.form
    mongo.db.users.update(doc, {"$set": doc}, upsert=True)
    return "Ok sent to client!"


@app.route("/")
def welcome_user():
    return "Welcome to the server! Use /translate_file to initiate translation request!"


@app.route("/auth_ok")
def auth_ok():
    print("Authentication is ok, redirecting to client app!")
    return redirect(frontend_address)


@app.route("/login")
def login():
    return redirect(
        f"{fusionauth_address}/oauth2/authorize?client_id={client_id}&response_type=code&redirect_uri={redirect_uri}"
    )


@app.route("/logout")
def logout():
    print("User logout! Access token will be cleared!")
    session.pop("access_token", None)
    session.pop("userId", None)
    return redirect(f"{fusionauth_address}/oauth2/logout?client_id={client_id}")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method != "POST":
        print("This should be a post method!")
        return (
            json.dumps("FAIL"),
            404,
            {"ContentType": "application/json"},
        )

    data = request.get_json()
    username, password, email = data["username"], data["password"], data["email"]
    user_request = {
        "sendSetPasswordEmail": False,
        "skipVerification": True,
        "user": {"email": email, "password": password, "username": username},
        "registration": {"applicationId": client_id},
    }

    user_resp = fusionAuthServer.register(user_request)

    if not user_resp.was_successful():
        return (
            json.dumps(user_resp.error_response),
            400,
            {"ContentType": "application/json"},
        )

    return (
        json.dumps(user_resp.success_response),
        200,
        {"ContentType": "application/json"},
    )


@app.route("/user")
def user():
    print(f"{session.sid} user")
    if "access_token" in session:
        user_resp = fusionAuthServer.retrieve_user_using_jwt(session["access_token"])
        if not user_resp.was_successful():
            print("Failed to get user info! Error: {}".format(user_resp.error_response))
            print("Resetting user session and logging out")
            session.pop("access_token", None)
            session.pop("userId", None)
            return redirect(f"{fusionauth_address}/oauth2/logout?client_id={client_id}")

        registrations = user_resp.success_response["user"]["registrations"]
        if (
            registrations is None
            or len(registrations) == 0
            or client_id not in [el["applicationId"] for el in registrations]
        ):
            print("User not registered for the application.")
            return (
                json.dumps({"user": {}, "registered": False}),
                200,
                {"ContentType": "application/json"},
            )

        return (
            json.dumps({"user": user_resp.success_response["user"]}),
            200,
            {"ContentType": "application/json"},
        )
    else:
        return (
            json.dumps({"user": {}, "registered": False, "logged_in": False}),
            200,
            {"ContentType": "application/json"},
        )


@app.route("/oauth-callback")
def oauth_callback():
    print(f"{session.sid} oauth callback")
    if "access_token" in session:
        return redirect("/auth_ok")

    if not request.args.get("code"):
        return "error"

    tok_resp = fusionAuthServer.exchange_o_auth_code_for_access_token(
        request.args.get("code"),
        client_id,
        f"{BACKEND_ADDRESS}/oauth-callback",
        client_secret,
    )
    if not tok_resp.was_successful():
        print("Failed to get token! Error: {}".format(tok_resp.error_response))
        return "error"

    session["access_token"] = tok_resp.success_response["access_token"]
    session["userId"] = tok_resp.success_response["userId"]
    # TODO: Why can't we just redirect to the frontend directly?
    return redirect("/auth_ok")


@app.route("/list_translations", methods=["GET"])
def list_translations():
    import os

    user_id = session["userId"]
    files_on_machine = mongo.db.users.find({"user_id": user_id})
    fnames = [os.path.basename(f["filepath"]) for f in files_on_machine]

    return json.dumps({"files": fnames})


@app.route("/translate_srt", methods=["GET", "POST"])
def translate_file():
    global translator
    if request.method == "POST":
        if (
            "file" not in request.files
            or "targetLanguage" not in request.form
            or "isSRT" not in request.form
        ):
            return (
                json.dumps({"success": False}),
                400,
                {"ContentType": "application/json"},
            )

        q = rq.Queue(connection=redis_con)
        file = request.files["file"]
        target_language = request.form["targetLanguage"]
        is_srt = request.form["isSRT"] == "true"
        filename = secure_filename(file.filename)
        user_id = session["userId"]

        if not os.path.exists(app.config["UPLOAD_FOLDER"]):
            os.makedirs(app.config["UPLOAD_FOLDER"])

        english_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

        with open(english_path, "w") as f:
            f.write(file.stream.read().decode("utf-8"))

        job = q.enqueue(
            file_translation_task,
            target_language,
            filename,
            user_id,
            app.config["UPLOAD_FOLDER"],
            app.config["TRANSLATE_FOLDER"],
            is_srt,
        )

        return (
            json.dumps(
                {
                    "success": True,
                    "job_url": url_for("get_job_status", job_id=job.get_id()),
                }
            ),
            200,
            {
                "ContentType": "application/json",
            },
        )


@app.route("/translate_paragraph", methods=["GET", "POST"])
def translate_paragraph():
    global translator
    if request.method == "POST":
        if (
            "translationParagraph" not in request.form
            or "targetLanguage" not in request.form
        ):
            return (
                json.dumps({"success": False}),
                400,
                {"ContentType": "application/json"},
            )

        q = rq.Queue(connection=redis_con)
        translate_paragraph = request.form["translationParagraph"]
        target_language = request.form["targetLanguage"]

        job = q.enqueue(
            paragraph_translation_task, target_language, translate_paragraph
        )

        return (
            json.dumps(
                {
                    "success": True,
                    "job_url": url_for("get_job_status", job_id=job.get_id()),
                }
            ),
            200,
            {
                "ContentType": "application/json",
            },
        )


@app.route("/get_translation/<translation_name>", methods=["GET"])
def get_translation(translation_name):
    filename = f"{translation_name}"
    try:
        return send_from_directory(
            os.path.join(app.config["TRANSLATE_FOLDER"], session["userId"]),
            filename=filename,
            as_attachment=True,
        )
    except FileNotFoundError:
        abort(404)


def get_files(user_id):
    results = mongo.db.users.find({"user_id": user_id})
    return results


if __name__ == "__main__":
    app.run(host="0.0.0.0")