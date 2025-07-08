from flask import Flask, jsonify
from flask_cors import CORS
from google import genai

app = Flask(__name__)
CORS(app)


genai_client = genai.Client()
MODEL="gemini-2.5-flash"


# a test route I temporary created just to know the endpoint works, I will rmove it before hackathon submission
@app.route("/")
def index():
    return "Hello world"

# future route I will implement
@app.route("/upload", method=["POST"])
def upload():
    # until my friends finish the frontend, I will just use a image for testing
    # file = request.file['image']

    uploaded_image = genai_client.files.upload(file="uploads/download.jpeg")

    response = genai_client.models.generate_content(
        model=MODEL,
        contents=[uploaded_image, "Analyze this plant or crop image and identify if there's any disease or pest on it, if there's any, provide remedies to cure it, make the response brief", "Return the result as plain text without formatting like **bold**, *, #", "If the the image does not contain any plant or crop, return 'No plant or crop found'"],
    )

    return jsonify({"response": response.text})

if __name__ == "__main__":
    app.run(debug=True) 