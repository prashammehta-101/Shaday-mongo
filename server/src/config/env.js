import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/shaday_db",
  jwtSecret: process.env.JWT_SECRET || "change-this-secret",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};
