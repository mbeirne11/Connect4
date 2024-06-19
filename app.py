from flask import Flask, render_template

#create flask
app = Flask(__name__)

#home route
@app.route("/")
def default():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True, port=5500)