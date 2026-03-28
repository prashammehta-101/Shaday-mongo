import CartItem from "../models/CartItem.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const formatOrder = (order) => ({
  id: order._id.toString(),
  orderNumber: order.orderNumber,
  status: order.status,
  paymentMethod: order.payment?.mode || "COD",
  paymentStatus: order.payment?.status || "PENDING",
  subtotal: order.subtotal,
  shippingFee: order.shippingFee,
  total: order.total,
  createdAt: order.createdAt,
  notes: order.notes,
  shipping: order.shipping,
  payment: order.payment,
  items: (order.items || []).map((item) => ({
    id: item._id.toString(),
    name: item.name,
    sku: item.sku,
    size: item.size,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
  })),
  user: order.userId
    ? { name: order.userId.name, email: order.userId.email }
    : undefined,
});

export const createOrder = asyncHandler(async (req, res) => {
  const { addressId, notes } = req.body;

  const cartItems = await CartItem.find({ userId: req.user.id })
    .populate("productId")
    .lean();

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty." });
  }

  // Resolve shipping address from user's saved addresses
  const user = await User.findById(req.user.id);
  let shippingAddress = {};
  if (addressId) {
    const addr = user.addresses.id(addressId);
    if (addr) {
      shippingAddress = {
        label: addr.label,
        line1: addr.line1,
        line2: addr.line2,
        city: addr.city,
        state: addr.state,
        country: addr.country,
        postalCode: addr.postalCode,
      };
    }
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 3999 ? 0 : 199;
  const total = subtotal + shippingFee;

  const order = await Order.create({
    userId: req.user.id,
    orderNumber: `SHADAY-${Date.now().toString().slice(-8)}`,
    subtotal,
    shippingFee,
    total,
    notes,
    shipping: shippingAddress,
    payment: {
      transactionId: "",
      mode: "COD",
      status: "PENDING",
      date: null,
    },
    items: cartItems.map((item) => ({
      productId: item.productId._id,
      sellerId: item.productId.sellerId,
      name: item.productId.name,
      sku: item.productId.sku,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.productId.price,
      totalPrice: item.productId.price * item.quantity,
    })),
  });

  await CartItem.deleteMany({ userId: req.user.id });

  res.status(201).json({ order: formatOrder(order.toObject()) });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ orders: orders.map(formatOrder) });
});

export const getAdminOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ orders: orders.map(formatOrder) });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  ).lean();

  if (!order) return res.status(404).json({ message: "Order not found." });

  res.json({ order: formatOrder(order) });
});
