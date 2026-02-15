import Inventory from "../models/Inventory.js";
import StockMovement from "../models/StockMovements.js";
import SalesHistory from "../models/SalesHistory.js";

export const createSale = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const inventory = await Inventory.findOne({ productId });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    if (inventory.totalStock - inventory.reservedStock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Deduct stock
    inventory.totalStock -= quantity;
    await inventory.save();

    // Stock movement
    await StockMovement.create({
      productId,
      type: "SALE",
      quantity,
      reason: "Customer sale"
    });

    // Daily sales aggregation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await SalesHistory.findOne({
      productId,
      date: today
    });

    if (existing) {
      existing.quantitySold += quantity;
      await existing.save();
    } else {
      await SalesHistory.create({
        productId,
        date: today,
        quantitySold: quantity
      });
    }

    res.json({ message: "Sale recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getSalesHistory = async (req, res) => {
  try {
    const { productId } = req.query;

    const filter = {};
    if (productId) filter.productId = productId;

    const history = await SalesHistory.find(filter)
      .populate("productId")
      .sort({ date: 1 });

    const formatted = history.map((s) => ({
      _id: s._id,

      // product fields
      productId: s.productId?._id,
      productName: s.productId?.name,
      sku: s.productId?.sku,
      category: s.productId?.category,

      // sales history fields
      date: s.date,
      quantitySold: s.quantitySold,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


