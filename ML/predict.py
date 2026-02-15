import sys
import pickle
import pandas as pd

avg_7 = float(sys.argv[1])
avg_14 = float(sys.argv[2])
avg_30 = float(sys.argv[3])

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

X = pd.DataFrame([[avg_7, avg_14, avg_30]],
                 columns=["avg_7", "avg_14", "avg_30"])

prediction = model.predict(X)[0]
print(round(prediction))
