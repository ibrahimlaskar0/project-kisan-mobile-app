from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
from dotenv import load_dotenv

import os
from datetime import datetime

app = Flask(__name__)
CORS(app) 

load_dotenv()

genai_client = genai.Client()
MODEL="gemini-2.5-flash"


UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Hello, World!"})

@app.route('/upload', methods=['POST'])
def upload_image():
    lang = request.args.get("lang", "en-US")
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
        path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(path)

        uploaded_image = genai_client.files.upload(file=path)

        response = genai_client.models.generate_content(
            model=MODEL,
            contents=[uploaded_image, "Analyze this plant or crop image and identify if there's any disease or pest on it, if there's any, provide remedies to cure it, make the response brief", "Return the result as plain text without formatting like **bold**, *, #", "The result should in " + lang, "If the the image does not contain any plant or crop, return 'No plant or crop found' or translated in " + lang],
        )        

        os.remove(path)

        return jsonify({"message": response.text}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



chat_session = genai_client.chats.create(
    model=MODEL,
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_budget=0),
        system_instruction="You are an agriculture assistant that answers farmer questions related to crops, diseases, pesticides, farming methods, and weather. If the user asks anything unrelated (like movies or politics), politely say you are not trained for that. Answer in simple language. Avoid technical jargon unless necessary. Keep answers short and practical. Return the result as plain text without formatting like **bold**, *, #"
    ),
    history=[]
)
chat_history = []

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get("message")

    if not message:
        return jsonify({ "message": "error" }), 400

    response = chat_session.send_message(message=message)

    

    chat_session.record_history(message, [response], chat_history, True)

    chat_history.append({"user": message})
    chat_history.append({"assistant": response.text})

    return jsonify({"response": response.text}), 200


@app.route("/voice_to_chat", methods=["POST"])
def voice_to_chat():
    lang = request.args.get("lang", "en-US")
    audio = request.files.get("audio")

    if not audio:
        return jsonify({"error": "No audio provided"}), 400

    file_path = f"uploads/{audio.filename}"
    audio.save(file_path)

    # Gemini transcription
    try:
        audio_file = genai_client.files.upload(file=file_path)

        response = genai_client.models.generate_content(
            model=MODEL, contents=[f"Give a transcription of this audio in {lang}", audio_file]
        )

        # chat_res = requests.post("http://localhost:5000/chat", json={
        #     "message": response.text,
        # })
        # return jsonify(chat_res.json())
        return jsonify({"response": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
