import axios from "axios";
import SalesHistory from "../models/SalesHistory.js";

export const predictDemand = async (req, res) => {
  try {
    const { productId } = req.body;

    const sales = await SalesHistory.find({ productId })
      .sort({ date: -1 })
      .limit(30);

    if (sales.length < 7) {
      return res.json({
        message: "Not enough data for ML. Use rule-based logic.",
      });
    }

    const quantities = sales.map((s) => s.quantitySold);

    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const avg7 = avg(quantities.slice(0, 7));
    const avg14 = avg(quantities.slice(0, 14));
    const avg30 = avg(quantities);

    // Call ML service deployed on Render
    const mlResponse = await axios.post(process.env.ML_API_URL, {
      avg_7: avg7,
      avg_14: avg14,
      avg_30: avg30,
    });

    return res.json({
      predictedDemand: mlResponse.data.predicted_demand,
      featuresUsed: { avg7, avg14, avg30 },
    });
  } catch (error) {
    return res.status(500).json({
      message: "ML prediction failed",
      error: error.message,
    });
  }
};
