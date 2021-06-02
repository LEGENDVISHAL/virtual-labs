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

@app.route('/sample')
def sample():
    return render_template("sample_expt.html")

@app.route('/expt/<expt_id>')
def expt(expt_id):
    return render_template(f'expt{expt_id}.html')

if __name__ == '__main__':
    app.run(debug=True, port=port)