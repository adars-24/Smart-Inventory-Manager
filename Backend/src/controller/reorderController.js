import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";

export const getLowStockProducts = async (req, res) => {
  try {
        const inventories = await Inventory.find().populate("productId");

    const lowStockItems = inventories
  .filter(item => {
    const available = item.totalStock - item.reservedStock;
    return available < item.productId.minStock;
  })
  .map(item => {
    const available = item.totalStock - item.reservedStock;
    const reorderQty = (item.productId.minStock * 2) - available;

    return {
      product: item.productId.name,
      availableStock: available,
      minStock: item.productId.minStock,
      suggestedReorderQty: reorderQty
    };
  });


    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
