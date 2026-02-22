import axios from "axios";
import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";
import SalesHistory from "../models/SalesHistory.js";

export const getSmartReorderSuggestion = async (req, res) => {
  try {
    const { productId } = req.body;

    const inventory = await Inventory.findOne({ productId }).populate("productId");

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    const availableStock = inventory.totalStock - inventory.reservedStock;

    // 🔹 Fetch last 30 sales
    const sales = await SalesHistory.find({ productId })
      .sort({ date: -1 })
      .limit(30);

    // 🔹 Fallback if not enough data
    if (sales.length < 7) {
      const ruleBasedQty =
        inventory.productId.minStock * 2 - availableStock;

      return res.json({
        strategy: "RULE_BASED",
        suggestedReorderQty: Math.max(0, ruleBasedQty),
      });
    }

    // 🔹 Feature Engineering
    const quantities = sales.map((s) => s.quantitySold);

    const avg = (arr) =>
      arr.reduce((a, b) => a + b, 0) / arr.length;

    const avg7 = avg(quantities.slice(0, 7));
    const avg14 = avg(quantities.slice(0, 14));
    const avg30 = avg(quantities);

    // 🔹 Call ML service (Render)
    const mlResponse = await axios.post(process.env.ML_API_URL, {
      avg_7: avg7,
      avg_14: avg14,
      avg_30: avg30,
    });

    const predictedDemand = mlResponse.data.predicted_demand;

    // 🔹 Safety Buffer (15%)
    const safetyBuffer = Math.ceil(predictedDemand * 0.15);

    const reorderQty = Math.max(
      0,
      predictedDemand - availableStock + safetyBuffer
    );

    return res.json({
      strategy: "ML_BASED",
      predictedDemand,
      safetyBuffer,
      availableStock,
      suggestedReorderQty: reorderQty,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Smart reorder prediction failed",
      error: error.message,
    });
  }
};
