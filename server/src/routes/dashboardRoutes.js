import { Router } from "express";
import { getAdminDashboard, getSellerDashboard } from "../controllers/dashboardController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
const router = Router();
router.get("/admin", requireAuth, requireRole("ADMIN"), getAdminDashboard);
router.get("/seller", requireAuth, requireRole("SELLER", "ADMIN"), getSellerDashboard);
export default router;
