/**
 * SHADAY MongoDB Seed Script
 * Run: npm run seed --workspace server
 * Creates: 1 admin, 1 seller, 1 customer + 6 sample products
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/shaday_db";

// ── Inline schemas (avoid circular import issues in seed) ──────────────────
const AddressSchema = new mongoose.Schema({ label: String, line1: String, line2: String, city: String, state: String, country: { type: String, default: "India" }, postalCode: String, isPrimary: Boolean });
const UserSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, passwordHash: String, phone: { type: String, sparse: true }, role: { type: String, enum: ["CUSTOMER","SELLER","ADMIN"], default: "CUSTOMER" }, emailVerified: { type: Boolean, default: false }, verificationToken: String, verificationExpiresAt: Date, addresses: [AddressSchema], registrationNo: String }, { timestamps: true });
const ProductImageSchema = new mongoose.Schema({ url: String, alt: String, sortOrder: Number });
const ProductVariantSchema = new mongoose.Schema({ size: String, stock: Number });
const ProductSchema = new mongoose.Schema({ sellerId: mongoose.Schema.Types.ObjectId, name: String, slug: { type: String, unique: true }, sku: { type: String, unique: true }, price: Number, compareAtPrice: Number, shortDesc: String, description: String, category: { fabric: String, texture: String, size: String }, fabric: String, color: String, fit: String, sleeve: String, pattern: String, collar: String, gsm: String, stock: Number, featured: Boolean, published: Boolean, images: [ProductImageSchema], variants: [ProductVariantSchema] }, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const hash = (p) => bcrypt.hash(p, 10);

const PRODUCTS = [
  { name: "Ivory Linen Classic", color: "Ivory", fabric: "Linen", fit: "REGULAR", sleeve: "FULL", pattern: "Solid", collar: "Spread", price: 2499, compareAtPrice: 3299, shortDesc: "Breathable linen for all-day elegance.", description: "Premium Irish linen woven for a cool, relaxed feel. Perfect for formal and semi-formal occasions.", gsm: "180", featured: true, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" },
  { name: "Midnight Navy Twill", color: "Midnight Navy", fabric: "Cotton Twill", fit: "SLIM", sleeve: "FULL", pattern: "Solid", collar: "Button-Down", price: 2799, compareAtPrice: 3499, shortDesc: "Sharp navy for boardrooms and evenings.", description: "Egyptian cotton twill in deep midnight navy. A wardrobe essential that bridges formal and casual.", gsm: "200", featured: true, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80" },
  { name: "Sage Oxford Shirt", color: "Sage", fabric: "Oxford Cotton", fit: "REGULAR", sleeve: "FULL", pattern: "Solid", collar: "Button-Down", price: 2199, shortDesc: "Earthy sage in a textured Oxford weave.", description: "Classic Oxford weave in a muted sage green. A versatile pick for casual Fridays and weekend outings.", gsm: "190", featured: true, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80" },
  { name: "Sandstone Poplin", color: "Sandstone", fabric: "Poplin", fit: "SLIM", sleeve: "HALF", pattern: "Solid", collar: "Spread", price: 1999, compareAtPrice: 2499, shortDesc: "Crisp poplin in a warm sandstone tone.", description: "Ultra-smooth poplin that irons flat in minutes. The sandstone tone complements any skin tone.", gsm: "120", featured: false, image: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80" },
  { name: "Coastal Blue Chambray", color: "Coastal Blue", fabric: "Chambray", fit: "RELAXED", sleeve: "FULL", pattern: "Textured", collar: "Button-Down", price: 2399, shortDesc: "Casual coastal blue with a denim-like hand.", description: "Chambray fabric with the look of denim and the comfort of cotton. Perfect relaxed-fit weekend shirt.", gsm: "170", featured: false, image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=800&q=80" },
  { name: "Charcoal Herringbone", color: "Charcoal", fabric: "Herringbone Wool-Blend", fit: "SLIM", sleeve: "FULL", pattern: "Herringbone", collar: "Spread", price: 3499, compareAtPrice: 4299, shortDesc: "Sophisticated herringbone for power dressing.", description: "A refined wool-cotton blend in a classic herringbone weave. Built for boardrooms and black-tie occasions.", gsm: "220", featured: false, image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80" },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Clear collections
  await User.deleteMany({});
  await Product.deleteMany({});
  console.log("Cleared existing data");

  const pw = await hash("Password@123");

  const [admin, seller, customer] = await User.insertMany([
    { name: "Shaday Admin", email: "admin@shaday.com", passwordHash: pw, role: "ADMIN", emailVerified: true, phone: "9000000001" },
    { name: "Shaday Seller", email: "seller@shaday.com", passwordHash: pw, role: "SELLER", emailVerified: true, phone: "9000000002" },
    { name: "Demo Customer", email: "customer@shaday.com", passwordHash: pw, role: "CUSTOMER", emailVerified: true, phone: "9000000003",
      addresses: [{ label: "Home", line1: "12 Marine Drive", city: "Mumbai", state: "Maharashtra", country: "India", postalCode: "400001", isPrimary: true }] },
  ]);
  console.log(`Created users: admin (${admin.email}), seller (${seller.email}), customer (${customer.email})`);

  const slugify = (t) => t.toLowerCase().replace(/[^\w\s-]/g,"").replace(/[\s_]+/g,"-");

  await Product.insertMany(
    PRODUCTS.map((p, i) => ({
      sellerId: seller._id,
      name: p.name,
      slug: `${slugify(p.name)}-${Date.now() + i}`,
      sku: `SHD-SEED-${String(i+1).padStart(3,"0")}`,
      price: p.price,
      compareAtPrice: p.compareAtPrice || null,
      shortDesc: p.shortDesc,
      description: p.description,
      fabric: p.fabric,
      color: p.color,
      fit: p.fit,
      sleeve: p.sleeve,
      pattern: p.pattern,
      collar: p.collar,
      gsm: p.gsm,
      stock: 50,
      featured: p.featured,
      published: true,
      category: { fabric: p.fabric, texture: p.pattern, size: "" },
      images: [{ url: p.image, alt: p.name, sortOrder: 0 }],
      variants: [
        { size: "S", stock: 10 }, { size: "M", stock: 15 },
        { size: "L", stock: 15 }, { size: "XL", stock: 10 },
      ],
    }))
  );
  console.log(`Created ${PRODUCTS.length} products`);

  console.log("\n✅ Seed complete!");
  console.log("─────────────────────────────");
  console.log("Demo accounts (password: Password@123)");
  console.log("  Admin:    admin@shaday.com");
  console.log("  Seller:   seller@shaday.com");
  console.log("  Customer: customer@shaday.com");
  console.log("─────────────────────────────");

  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
