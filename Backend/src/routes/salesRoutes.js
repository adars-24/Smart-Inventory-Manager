import express from "express";
import { createSale , getSalesHistory} from "../controller/salesController.js";

const router = express.Router();

router.post("/", createSale);
router.get("/history",getSalesHistory);

export default router;
