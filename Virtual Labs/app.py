from flask import Flask,render_template, redirect, request
app = Flask(__name__)
port=8000

@app.route('/')
@app.route('/home')
def home():
    return render_template("home.html")

@app.route('/index')
def index():
    return render_template("index.html")

@app.route('/expt')
def expt():
    return render_template("expt1.html")

if __name__ == '__main__':
    app.run(debug=True, port=port)