import Review from "../models/Review.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, title, comment } = req.body;

  const review = await Review.findOneAndUpdate(
    { userId: req.user.id, productId },
    { rating: Number(rating), title, comment },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ review });
});
