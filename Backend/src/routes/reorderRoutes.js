import express from "express";

import { getLowStockProducts } from "../controller/reorderController.js";

const router = express.Router();

router.get("/low-stock", getLowStockProducts);

export default router;