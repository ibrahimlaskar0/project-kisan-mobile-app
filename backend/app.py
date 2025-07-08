from flask import Flask

app = Flask(__name__)


# a test route I temporary created just to know the endpoint works, I will rmove it before hackathon submission
@app.route("/")
def index():
    return "Hello world"

if __name__ == "__main__":
    app.run(debug=True)