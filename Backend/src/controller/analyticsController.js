import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";
import SalesHistory from "../models/SalesHistory.js";

export const getAnalyticsSummary = async (req, res) => {
  try {
    // 1) Total products
    const products = await Product.find();
    const totalProducts = products.length;

    // 2) Inventory list
    const inventory = await Inventory.find().populate("productId");

    let lowStockCount = 0;
    let outOfStockCount = 0;

    const inventoryByCategoryMap = {};

    for (const item of inventory) {
      const product = item.productId;
      if (!product) continue;

      const availableStock = item.totalStock - item.reservedStock;

      if (availableStock === 0) outOfStockCount++;
      if (availableStock < (product.minStock ?? 10)) lowStockCount++;

      const cat = product.category || "Other";
      inventoryByCategoryMap[cat] = (inventoryByCategoryMap[cat] || 0) + availableStock;
    }

    const inventoryByCategory = Object.entries(inventoryByCategoryMap).map(
      ([category, stock]) => ({ category, stock })
    );

    // 3) Category distribution (count products per category)
    const categoryDistributionMap = {};
    for (const p of products) {
      const cat = p.category || "Other";
      categoryDistributionMap[cat] = (categoryDistributionMap[cat] || 0) + 1;
    }

    const categoryDistribution = Object.entries(categoryDistributionMap).map(
      ([name, value]) => ({ name, value })
    );

    // 4) Sales trend (last 30 days)
    const last30 = new Date();
    last30.setDate(last30.getDate() - 30);

    const salesHistory = await SalesHistory.find({ date: { $gte: last30 } }).sort({ date: 1 });

    const salesTrend = salesHistory.map((s) => ({
      date: s.date.toISOString().split("T")[0],
      unitsSold: s.quantitySold,
    }));

    const itemsSold30Days = salesHistory.reduce((sum, s) => sum + s.quantitySold, 0);

    res.json({
      cards: {
        totalProducts,
        itemsSold30Days,
        lowStockCount,
        outOfStockCount,
      },
      salesTrend,
      categoryDistribution,
      inventoryByCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
