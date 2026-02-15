import express from "express";
import { stockIn, stockOut ,getInventoryList} from "../controller/inventoryController.js";

const router = express.Router();

router.post("/stock-in", stockIn);
router.post("/stock-out", stockOut);
router.get("/", getInventoryList);


export default router;