import os
from flask import Flask, request, jsonify, send_from_directory
try:
    from . import util
except ImportError:
    import util

app = Flask(__name__)

CLIENT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'client'))

# Load model artifacts when module is imported so it works with
# `python server.py`, `flask run`, and production WSGI servers.
util.load_saved_artifacts()

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    locations = util.get_location_names()
    if locations is None:
        util.load_saved_artifacts()
        locations = util.get_location_names()

    response = jsonify({
        'locations': locations
    })
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


@app.route('/api/get_location_names', methods=['GET'])
def get_location_names_api():
    return get_location_names()

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    total_sqft = float(request.form['total_sqft'])
    location = request.form['location']
    bhk = int(request.form['bhk'])
    bath = int(request.form['bath'])

    response = jsonify({
        'estimated_price': util.get_estimated_price(location,total_sqft,bhk,bath)
    })
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


@app.route('/api/predict_home_price', methods=['POST'])
def predict_home_price_api():
    return predict_home_price()


@app.route('/', methods=['GET'])
def index():
    return send_from_directory(CLIENT_DIR, 'app.html')


@app.route('/<path:path>', methods=['GET'])
def static_files(path):
    return send_from_directory(CLIENT_DIR, path)

if __name__ == "__main__":
    print("Starting Python Flask Server For Home Price Prediction...")
    util.load_saved_artifacts()
    app.run()