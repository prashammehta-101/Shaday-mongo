import Product from "../models/Product.js";
import Review from "../models/Review.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { slugify } from "../utils/slugify.js";

const populateProduct = async (product) => {
  const reviews = await Review.find({ productId: product._id })
    .populate("userId", "name")
    .sort({ createdAt: -1 })
    .lean();

  const rating =
    reviews.length > 0
      ? Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
      : 0;

  return {
    ...product,
    id: product._id.toString(),
    reviews: reviews.map((r) => ({
      id: r._id.toString(),
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      user: { name: r.userId?.name || "Anonymous" },
    })),
    rating,
  };
};

export const getProducts = asyncHandler(async (req, res) => {
  const { search = "", color, fit, sleeve, minPrice, maxPrice, featured, sort = "latest" } = req.query;

  const filter = { published: true };
  if (search) filter.name = { $regex: search, $options: "i" };
  if (color) filter.color = color;
  if (fit) filter.fit = fit;
  if (sleeve) filter.sleeve = sleeve;
  if (featured) filter.featured = featured === "true";
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sortObj =
    sort === "price-asc" ? { price: 1 } : sort === "price-desc" ? { price: -1 } : { createdAt: -1 };

  const rawProducts = await Product.find(filter)
    .populate("sellerId", "name")
    .sort(sortObj)
    .lean();

  const products = await Promise.all(
    rawProducts.map(async (p) => {
      const full = await populateProduct(p);
      return {
        ...full,
        seller: p.sellerId ? { id: p.sellerId._id.toString(), name: p.sellerId.name } : null,
      };
    })
  );

  res.json({ products });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const raw = await Product.findOne({ slug: req.params.slug })
    .populate("sellerId", "name")
    .lean();

  if (!raw) return res.status(404).json({ message: "Product not found." });

  const product = await populateProduct(raw);
  product.seller = raw.sellerId ? { id: raw.sellerId._id.toString(), name: raw.sellerId.name } : null;

  res.json({ product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name, price, compareAtPrice, shortDesc, description,
    fabric, color, fit, sleeve, pattern, collar, gsm,
    stock, featured, published, images = [], sizes = [],
  } = req.body;

  const baseSlug = slugify(name);
  const sku = `SHD-${Date.now().toString().slice(-6)}`;

  const product = await Product.create({
    sellerId: req.user.id,
    name,
    slug: `${baseSlug}-${Date.now().toString().slice(-4)}`,
    sku,
    price: Number(price),
    compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
    shortDesc,
    description,
    fabric,
    color,
    fit,
    sleeve,
    pattern,
    collar,
    gsm,
    stock: Number(stock),
    featured: Boolean(featured),
    published: published !== false,
    category: { fabric, texture: "", size: "" },
    images: images.map((url, index) => ({ url, sortOrder: index })),
    variants: sizes.map((s) => ({ size: s.label, stock: Number(s.stock) })),
  });

  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });

  if (req.user.role === "SELLER" && product.sellerId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Cannot edit another seller's product." });
  }

  Object.assign(product, req.body);
  await product.save();

  res.json({ product });
});

export const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ sellerId: req.user.id })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ products: products.map((p) => ({ ...p, id: p._id.toString() })) });
});
