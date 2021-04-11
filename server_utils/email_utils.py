from werkzeug.utils import secure_filename
from flask_mail import Message

ALLOWED_EXTENSIONS = {"txt", "pdf", "png", "jpg", "jpeg", "gif", "srt"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def send_email(file, translated, mail):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        msg = Message(
            "This is your subtitle!",
            sender="youremail@domain.com",
            recipients=["youremail@domain.com"],
        )
        msg.attach("ro_" + filename, "text/plain", translated)
        mail.send(msg)