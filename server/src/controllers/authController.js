import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/jwt.js";
import { normalizeEmail, isValidEmail, isValidPhone, isValidPassword } from "../utils/validation.js";

const buildAuthPayload = (user) => ({
  token: signToken({ userId: user._id.toString(), role: user.role }),
  user: {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    emailVerified: user.emailVerified,
    addresses: user.addresses,
  },
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({
      message: "Password must be 8+ chars with 1 capital letter, 1 special symbol, and 3+ numbers.",
    });
  }
  if (phone && !isValidPhone(phone)) {
    return res.status(400).json({ message: "Enter a valid 10-digit Indian phone number." });
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return res.status(409).json({ message: "Email already in use." });

  if (phone) {
    const phoneTaken = await User.findOne({ phone: phone.trim() });
    if (phoneTaken) return res.status(409).json({ message: "Phone number already in use." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(24).toString("hex");
  const verificationExpiresAt = new Date(Date.now() + 1000 * 60 * 30);

  const user = await User.create({
    name,
    email: normalizedEmail,
    phone: phone ? phone.trim() : undefined,
    passwordHash,
    role: role === "SELLER" ? "SELLER" : "CUSTOMER",
    verificationToken,
    verificationExpiresAt,
  });

  const requestOrigin = req.headers.origin || "http://localhost:5173";
  const verificationLink = `${requestOrigin}/verify-email?token=${verificationToken}`;
  console.log(`SHADAY verify email for ${user.email}: ${verificationLink}`);

  res.status(201).json({
    message: "Account created. Check console for the verification link (dev mode).",
    verificationLink,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: normalizeEmail(email) });

  if (!user) return res.status(401).json({ message: "Invalid email or password." });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid email or password." });

  if (!user.emailVerified) {
    return res.status(403).json({ message: "Please verify your email before logging in." });
  }

  res.json(buildAuthPayload(user));
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash -verificationToken -verificationExpiresAt");
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ user: { ...user.toObject(), id: user._id.toString() } });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const token = String(req.query.token || "");
  if (!token) return res.status(400).json({ message: "Verification token is required." });

  const user = await User.findOne({
    verificationToken: token,
    verificationExpiresAt: { $gt: new Date() },
  });

  if (!user) return res.status(400).json({ message: "Verification link is invalid or expired." });

  user.emailVerified = true;
  user.verificationToken = null;
  user.verificationExpiresAt = null;
  await user.save();

  res.json({ message: "Email verified successfully. You can now log in." });
});

export const addAddress = asyncHandler(async (req, res) => {
  const { label, line1, line2, city, state, country, postalCode, isPrimary } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found." });

  if (isPrimary) {
    user.addresses.forEach((a) => { a.isPrimary = false; });
  }

  user.addresses.push({ label, line1, line2, city, state, country: country || "India", postalCode, isPrimary: Boolean(isPrimary) });
  await user.save();

  const newAddress = user.addresses[user.addresses.length - 1];
  res.status(201).json({ address: newAddress });
});
