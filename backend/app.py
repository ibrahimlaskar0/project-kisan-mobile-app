from flask import Flask

app = Flask(__name__)


# a test route I temporary created just to know the endpoint works, I will rmove it before hackathon submission
@app.route("/")
def index():
    return "Hello world"

# future route I will implement
@app.route("/upload", method=["POST"])
def upload():
    pass

if __name__ == "__main__":
    app.run(debug=True) 