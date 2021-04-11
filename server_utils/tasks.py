import os
import sys

sys.path.append("..")

from model.translator import TranslatorSrt, TranslatorPlainText
from configs.server_vars import BACKEND_ADDRESS


def file_translation_task(
    target_language, filename, user_id, upload_folder, translate_folder, is_srt
):
    import requests

    print("Starting task...")

    translator = (
        TranslatorSrt(targetLanguage=target_language)
        if is_srt
        else TranslatorPlainText(targetLanguage=target_language)
    )

    english_path = os.path.join(upload_folder, filename)

    print("Entering translate File")
    translated = translator.translateFile(open(english_path), target_language)

    user_dir = os.path.join(translate_folder, user_id)

    if not os.path.exists(user_dir):
        os.makedirs(user_dir, exist_ok=True)

    translated_path = os.path.join(user_dir, f"{target_language}_" + filename)

    print(f"Writing translated {translated_path}")
    with open(translated_path, "w") as f:
        f.write(translated)

    doc = {"user_id": user_id, "filepath": translated_path, "machine": "pc_1"}
    print("Done translating!")
    print(f"The user id is {user_id}")
    requests.post(f"{BACKEND_ADDRESS}/job_done", doc)

    return None


def paragraph_translation_task(target_language, paragraph):
    print("Starting task...")

    parser = TranslatorPlainText(targetLanguage=target_language)

    print("Entering translate File")
    translated = parser.translateFile(paragraph, target_language)

    return translated.strip()