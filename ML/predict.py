import pickle
import pandas as pd

MODEL_PATH = "model.pkl"

# Load model once (faster)
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)


def predict_demand(data):
    """
    data should be a dict like:
    {
      "avg_7": 12,
      "avg_14": 10,
      "avg_30": 9
    }
    """

    avg_7 = float(data.get("avg_7", 0))
    avg_14 = float(data.get("avg_14", 0))
    avg_30 = float(data.get("avg_30", 0))

    X = pd.DataFrame([[avg_7, avg_14, avg_30]],
                     columns=["avg_7", "avg_14", "avg_30"])

    prediction = model.predict(X)[0]

    return {
        "avg_7": avg_7,
        "avg_14": avg_14,
        "avg_30": avg_30,
        "predicted_demand": int(round(prediction))
    }
