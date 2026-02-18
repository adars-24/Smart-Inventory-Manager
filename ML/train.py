import pandas as pd
from pymongo import MongoClient
from sklearn.linear_model import LinearRegression
import pickle
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

print("MONGO_URI Loaded:", MONGO_URI[:30], "...")


if not MONGO_URI:
    raise Exception("❌ MONGO_URI not found. Add it in ML/.env")

client = MongoClient(MONGO_URI)

db = client["test"]
sales = list(db.saleshistories.find())

print("DBs:", client.list_database_names())
print("Collections:", db.list_collection_names())
print("Sample doc:", sales[0] if len(sales) > 0 else "No data")


df = pd.DataFrame(sales)

df["date"] = pd.to_datetime(df["date"])
df = df.sort_values("date")

df["avg_7"] = df["quantitySold"].rolling(7, min_periods=1).mean()
df["avg_14"] = df["quantitySold"].rolling(14, min_periods=1).mean()
df["avg_30"] = df["quantitySold"].rolling(30, min_periods=1).mean()

X = df[["avg_7", "avg_14", "avg_30"]]
y = df["quantitySold"]


model = LinearRegression()
model.fit(X, y)

with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model trained & saved as model.pkl")
