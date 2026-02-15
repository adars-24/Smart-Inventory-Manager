import mongoose from "mongoose";

const salesHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    quantitySold: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("SalesHistory", salesHistorySchema);
