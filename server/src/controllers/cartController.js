import CartItem from "../models/CartItem.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const populateCart = (item) => ({
  id: item._id.toString(),
  quantity: item.quantity,
  size: item.size,
  product: {
    ...item.productId,
    id: item.productId._id.toString(),
    price: item.productId.price,
    compareAtPrice: item.productId.compareAtPrice || null,
  },
});

export const getCart = asyncHandler(async (req, res) => {
  const items = await CartItem.find({ userId: req.user.id })
    .populate({ path: "productId", populate: { path: "sellerId", select: "name" } })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ items: items.map(populateCart) });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, size, quantity } = req.body;

  const existing = await CartItem.findOne({ userId: req.user.id, productId, size });

  let item;
  if (existing) {
    existing.quantity += Number(quantity);
    await existing.save();
    item = existing;
  } else {
    item = await CartItem.create({ userId: req.user.id, productId, size, quantity: Number(quantity) });
  }

  const populated = await CartItem.findById(item._id)
    .populate({ path: "productId", populate: { path: "sellerId", select: "name" } })
    .lean();

  res.status(201).json({ item: populateCart(populated) });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const item = await CartItem.findByIdAndUpdate(
    req.params.id,
    { quantity: Number(req.body.quantity) },
    { new: true }
  ).populate({ path: "productId" }).lean();

  if (!item) return res.status(404).json({ message: "Cart item not found." });

  res.json({ item: populateCart(item) });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  await CartItem.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
