import pandas as pd
from pymongo import MongoClient
from sklearn.linear_model import LinearRegression
import pickle
from datetime import datetime

client = MongoClient("YOUR_MONGO_URI")
db = client.inventory
sales = list(db.saleshistories.find())

df = pd.DataFrame(sales)

df["date"] = pd.to_datetime(df["date"])
df = df.sort_values("date")

df["avg_7"] = df["quantitySold"].rolling(7).mean()
df["avg_14"] = df["quantitySold"].rolling(14).mean()
df["avg_30"] = df["quantitySold"].rolling(30).mean()

df = df.dropna()

X = df[["avg_7", "avg_14", "avg_30"]]
y = df["quantitySold"]

model = LinearRegression()
model.fit(X, y)

with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model trained & saved ✅")
