import express from "express";
// import { predictDemand } from "../controllers/mlController.js";
import { predictDemand } from "../controller/mlController.js";

const router = express.Router();

router.post("/predict", predictDemand);

export default router;
