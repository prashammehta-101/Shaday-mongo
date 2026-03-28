import mongoose from "mongoose";

// ProductImage sub-document
const ProductImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: true }
);

// ProductVariant sub-document (size variants)
const ProductVariantSchema = new mongoose.Schema(
  {
    size: { type: String, required: true }, // S, M, L, XL, XXL
    stock: { type: Number, default: 0 },
  },
  { _id: true }
);

// Category embedded (fabric, texture, size from ER Category entity)
const CategorySchema = new mongoose.Schema(
  {
    fabric: { type: String, default: "" },   // Category.fabric
    texture: { type: String, default: "" },  // Category.texture
    size: { type: String, default: "" },     // Category.size
  },
  { _id: false }
);

// Product schema (P_id, Price, Name from ER + Item: I_id, O_id, Name)
const ProductSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: null },
    shortDesc: { type: String, default: "" },
    description: { type: String, default: "" },

    // Category (belongs relationship from ER)
    category: { type: CategorySchema, default: () => ({}) },

    // Product attributes
    fabric: { type: String, default: "" },
    color: { type: String, default: "" },
    fit: { type: String, enum: ["SLIM", "REGULAR", "RELAXED"], default: "REGULAR" },
    sleeve: { type: String, enum: ["FULL", "HALF"], default: "FULL" },
    pattern: { type: String, default: "" },
    collar: { type: String, default: "" },
    gsm: { type: String, default: "" },

    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },

    images: { type: [ProductImageSchema], default: [] },
    variants: { type: [ProductVariantSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
