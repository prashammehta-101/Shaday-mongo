import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { timestamps: true }
);

// Unique per user + product + size combo
CartItemSchema.index({ userId: 1, productId: 1, size: 1 }, { unique: true });

export default mongoose.model("CartItem", CartItemSchema);
