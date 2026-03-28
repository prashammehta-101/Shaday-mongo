import WishlistItem from "../models/WishlistItem.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getWishlist = asyncHandler(async (req, res) => {
  const items = await WishlistItem.find({ userId: req.user.id })
    .populate({ path: "productId" })
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    items: items.map((item) => ({
      id: item._id.toString(),
      product: { ...item.productId, id: item.productId._id.toString() },
    })),
  });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const existing = await WishlistItem.findOne({ userId: req.user.id, productId });

  if (existing) {
    await existing.deleteOne();
    return res.json({ saved: false });
  }

  await WishlistItem.create({ userId: req.user.id, productId });
  return res.json({ saved: true });
});
