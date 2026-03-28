import { Router } from "express";
import { createOrder, getMyOrders, getAdminOrders, updateOrderStatus } from "../controllers/orderController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
const router = Router();
router.post("/", requireAuth, createOrder);
router.get("/mine", requireAuth, getMyOrders);
router.get("/admin/all", requireAuth, requireRole("ADMIN"), getAdminOrders);
router.patch("/:id/status", requireAuth, requireRole("ADMIN"), updateOrderStatus);
export default router;
