import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";

export const createProduct = async (req , res) => {
    try {
        const {name, sku, category , supplier , minStock} = req.body;

        const existing = await Product.findOne({sku});

        if(existing){
            return res.status(400).json({message : "sku already exists"})
        }

         const product = await Product.create({
      name,
      sku,
      category,
      supplier,
      minStock
    });

    // Auto create inventory 
    await Inventory.create({
        productId: product._id
    });

    res.status(201).json(product);


    } catch (error) {
        res.status(500).json({message : error.message});
    }
};


export const getProducts = async (req,res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, category, supplier, minStock } = req.body;

    // allowed updates only
    const updates = {
      name,
      sku,
      category,
      supplier,
      minStock,
    };

    // remove undefined fields
    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) delete updates[key];
    });

    // if sku is being changed, ensure uniqueness
    if (sku) {
      const existing = await Product.findOne({ sku, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ message: "SKU already exists" });
      }
    }

    const updated = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete inventory record too (important)
    await Inventory.findOneAndDelete({ productId: id });

    // Delete stock movements too (optional but clean)
    // await StockMovement.deleteMany({ productId: id });

    await Product.findByIdAndDelete(id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
