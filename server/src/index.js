import cors from "cors";
import express from "express";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

const app = express();

const allowedOrigins = [env.clientUrl, "http://127.0.0.1:5173", "http://localhost:5173"];
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || /localhost:\d+/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked for this origin."));
      }
    },
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true, brand: "SHADAY", db: "MongoDB" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(env.port, () => {
    console.log(`SHADAY API running on http://localhost:${env.port}`);
    console.log(`Connect your MongoDB at: ${env.mongoUri}`);
  });
});
