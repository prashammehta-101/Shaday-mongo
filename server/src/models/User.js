import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" },
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: "India" },
    postalCode: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: true }
);

// Shaday entity fields (email_id, contact_no, u_name, registration_no)
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, unique: true, sparse: true, trim: true },

    // ISA roles: CUSTOMER, SELLER, ADMIN
    role: { type: String, enum: ["CUSTOMER", "SELLER", "ADMIN"], default: "CUSTOMER" },

    // Email verification
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    verificationExpiresAt: { type: Date, default: null },

    // Admin-specific fields (A_name, A_password inherited, A_id as _id)
    // Seller-specific fields (S_id as _id)
    // Customer-specific fields (U_id as _id)

    // Embedded addresses (belongs relationship from ER)
    addresses: { type: [AddressSchema], default: [] },

    // Registration number (Shaday entity)
    registrationNo: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
