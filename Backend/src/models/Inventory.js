import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true
    },
    totalStock: {
      type: Number,
      default: 0
    },
    reservedStock: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Virtual field (not stored in DB)
inventorySchema.virtual("availableStock").get(function () {
  return this.totalStock - this.reservedStock;
});

export default mongoose.model("Inventory", inventorySchema);
