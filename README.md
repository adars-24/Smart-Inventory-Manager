# Smart Inventory Management System 📦🤖🚀

A **Smart Inventory Management System** built using the **MERN Stack + Machine Learning** to manage products, stock levels, suppliers, purchases, and sales efficiently.  
It also includes **ML-based demand prediction** to forecast future product requirements and reduce stock-outs.

---

## 🔥 Key Features

### ✅ Inventory Management
- Product Management (CRUD)
- Category & Supplier Management
- Stock In / Stock Out Tracking
- Purchase & Sales History
- Search, Filter, Sorting

### ✅ Smart Features (ML + Analytics)
- 📊 Dashboard Analytics (Stock, Sales, Revenue, Trends)
- ⚠️ Low Stock Alerts (based on threshold)
- 🤖 ML Demand Prediction (Forecast product demand using historical sales data)
- 📈 Restock Recommendation based on predicted demand

### ✅ Security & Access
- User Authentication (JWT)
- Role-Based Access (Admin / Staff)

### ✅ UI
- Fully Responsive UI (Mobile + Desktop)
- Clean UI using Material UI (MUI)

---

## 🧠 Machine Learning Prediction Module

The system uses historical sales data to train a machine learning model that predicts future demand for each product.

### Prediction Output Includes:
- Expected demand for next days/weeks
- Recommended restock quantity
- Products likely to go out of stock soon

### ML Workflow:
1. Collect sales history data from database
2. Preprocess data (missing values, scaling, encoding)
3. Train model (Regression / Time Series based)
4. Evaluate using metrics (RMSE, MAE, R²)
5. Deploy predictions in dashboard

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Material UI (MUI)
- Axios
- Redux Toolkit (if used)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

### Machine Learning
- Python (Flask/FastAPI for serving ML model) OR Node-based ML integration
- Scikit-learn / Pandas / NumPy
- Model Evaluation (RMSE, MAE, R²)

---

## 📂 Folder Structure

```bash
smart-inventory/
│
├── client/              # React frontend
├── server/              # Node + Express backend
├── ml-service/          # ML model + prediction API (Flask/FastAPI)
├── README.md
└── package.json
