import express from "express";
import { getSmartReorderSuggestion } from "../controller/smartReorderController.js";

const router = express.Router();

router.post("/suggest", getSmartReorderSuggestion);

export default router;
