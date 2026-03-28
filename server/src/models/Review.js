import mongoose from "mongoose";

// Review entity from ER: r_id, writes (U_id, U_id), are (r_id, P_id)
const ReviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: "" },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

// One review per user per product
ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model("Review", ReviewSchema);
