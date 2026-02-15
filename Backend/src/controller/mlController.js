import { exec } from "child_process";
import SalesHistory from "../models/SalesHistory.js";

export const predictDemand = async (req, res) => {
  try {
    const { productId } = req.body;

    const sales = await SalesHistory.find({ productId })
      .sort({ date: -1 })
      .limit(30);

    if (sales.length < 7) {
      return res.json({
        message: "Not enough data for ML. Use rule-based logic."
      });
    }

    const quantities = sales.map(s => s.quantitySold);

    const avg = (arr) =>
      arr.reduce((a, b) => a + b, 0) / arr.length;

    const avg7 = avg(quantities.slice(0, 7));
    const avg14 = avg(quantities.slice(0, 14));
    const avg30 = avg(quantities);

    const command = `python ML/predict.py ${avg7} ${avg14} ${avg30}`;

    exec(command, (error, stdout) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }

      const predictedDemand = Number(stdout.trim());

      res.json({
        predictedDemand,
        featuresUsed: {
          avg7,
          avg14,
          avg30
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
