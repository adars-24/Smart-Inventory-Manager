import express from "express";
import cors from "cors";

import inventoryRoutes from "./routes/inventoryRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import salesRoute from "./routes/salesRoutes.js";
import reorderRoutes from "./routes/reorderRoutes.js"
import mlRoutes from "./routes/mlRoutes.js"
import smartRrorderRoutes from "./routes/smartReorderRoutes.js"
import authRoutes from "./routes/authRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js"
import userRoutes from "./routes/userRoutes.js"


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/inventory" , inventoryRoutes);
app.use("/api/products" , productRoutes);
app.use("/api/sales" , salesRoute);
app.use("/api/reorder" , reorderRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/smart-reorder", smartRrorderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);






app.get("/", (req,res) => {
    res.send("Inventory API running");
});

export default app;



