import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    sku: {     //stock keeping unit
      type: String,
      required: true,
      unique: true
    },
    category: {
      type: String
    },
    supplier: {
      type: String
    },
    minStock: {
      type: Number,
      default: 10
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
