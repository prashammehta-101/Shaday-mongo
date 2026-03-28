import mongoose from "mongoose";

// OrderItem sub-document (contains relationship: Item to Order from ER)
const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    sku: { type: String, default: "" },
    size: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: true }
);

// Shipping sub-document (S_id, address from ER — "is" relationship Order→Shipping)
const ShippingSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" },
    line1: { type: String, default: "" },
    line2: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "India" },
    postalCode: { type: String, default: "" },
  },
  { _id: false }
);

// Payment sub-document (transaction_id, mode, date — "has" relationship Order→Payment)
const PaymentSchema = new mongoose.Schema(
  {
    transactionId: { type: String, default: "" },
    mode: { type: String, default: "COD" },          // COD, ONLINE, etc.
    status: { type: String, default: "PENDING" },    // PENDING, PAID, FAILED
    date: { type: Date, default: null },
  },
  { _id: false }
);

// Order schema — places relationship: User places Order
const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, required: true, unique: true },

    status: {
      type: String,
      enum: ["PLACED", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },

    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },

    notes: { type: String, default: "" },

    // Embedded items (contains relationship from ER: I_id, O_id, Name)
    items: { type: [OrderItemSchema], default: [] },

    // Embedded shipping address snapshot (is relationship from ER)
    shipping: { type: ShippingSchema, default: () => ({}) },

    // Embedded payment (has relationship from ER: transaction_id, mode, date)
    payment: { type: PaymentSchema, default: () => ({}) },

    // adds relationship: Admin adds Order (A_id, U_id from ER)
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
