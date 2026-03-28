import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const [users, products, orders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);

  const revenueAgg = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);
  const revenue = revenueAgg[0]?.total || 0;

  res.json({ metrics: { users, products, orders, revenue } });
});

export const getSellerDashboard = asyncHandler(async (req, res) => {
  const products = await Product.countDocuments({ sellerId: req.user.id });

  const orderAgg = await Order.aggregate([
    { $unwind: "$items" },
    { $match: { "items.sellerId": req.user.id } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        revenue: { $sum: "$items.totalPrice" },
      },
    },
  ]);

  const orders = orderAgg[0]?.count || 0;
  const revenue = orderAgg[0]?.revenue || 0;

  res.json({ metrics: { products, orders, revenue } });
});
