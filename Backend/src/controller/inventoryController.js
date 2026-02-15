import Inventory from "../models/Inventory.js";

import StockMovement from "../models/StockMovements.js";

export const stockIn = async(req , res) => {
    try {
        const {productId , quantity , reason} = req.body;

        const inventory = await Inventory.findOne({productId});
        if(!inventory){
           return res.status(404).json({message : "Inventory not found"})
        }

        inventory.totalStock += quantity;
        await inventory.save();

         await StockMovement.create({
      productId,
      type: "IN",
      quantity,
      reason
    });

    res.json({ message: "Stock added successfully", inventory });

    } catch (error) {
        res.status(500).json({message : error.message});
    }
};


export const stockOut = async (req, res) => {
  try {
    const { productId, quantity, reason } = req.body;

    const inventory = await Inventory.findOne({ productId });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    if (inventory.totalStock - inventory.reservedStock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    inventory.totalStock -= quantity;
    await inventory.save();

    await StockMovement.create({
      productId,
      type: "OUT",
      quantity,
      reason
    });

    res.json({ message: "Stock removed successfully", inventory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getInventoryList = async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate("productId")
      .sort({ updatedAt: -1 });

    const formatted = inventory.map((item) => {
      const product = item.productId;

      const availableStock = item.totalStock - item.reservedStock;

      return {
        inventoryId: item._id,
        productId: product?._id,
        name: product?.name,
        sku: product?.sku,
        category: product?.category,
        supplier: product?.supplier,
        minStock: product?.minStock ?? 10,
        totalStock: item.totalStock,
        reservedStock: item.reservedStock,
        availableStock,
        updatedAt: item.updatedAt,
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
