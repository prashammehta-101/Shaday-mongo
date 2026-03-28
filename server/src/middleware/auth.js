import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId).select("_id name email role");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied." });
  }
  next();
};
