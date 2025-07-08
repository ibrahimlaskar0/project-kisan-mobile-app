from flask import Flask, jsonify
from flask_cors import CORS
from google import genai

app = Flask(__name__)
CORS(app)


genai_client = genai.Client()
MODEL="gemini-2.5-flash"


# camera functionality
@app.route("/upload", method=["POST"])
def upload_image():
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
            contents=[uploaded_image, "Analyze this plant or crop image and identify if there's any disease or pest on it, if there's any, provide remedies to cure it, make the response brief", "Return the result as plain text without formatting like **bold**, *, #", "If the the image does not contain any plant or crop, return 'No plant or crop found'"],
        )        

        os.remove(path)

        return jsonify({"message": response.text}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True) 