import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    type: {
      type: String,
      enum: ["IN", "OUT", "SALE", "RETURN", "DAMAGE"],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    reason: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("StockMovement", stockMovementSchema);
