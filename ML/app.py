from flask import Flask, request, jsonify
from predict import predict_demand

app = Flask(__name__)

@app.get("/")
def home():
    return "ML Service Running 🚀"

@app.post("/predict")
def predict():
    try:
        data = request.get_json()
        result = predict_demand(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🔥 THIS IS IMPORTANT FOR LOCAL RUN
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
