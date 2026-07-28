import express from "express";
import { createOrder, downloadAdminInvoice, downloadMyInvoice, getOrders, getMyOrderById, getMyOrders, updateOrderStatus } from "../controllers/orderController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protectAdmin, getOrders);
router.patch("/:id/status", protectAdmin, updateOrderStatus);
router.get("/:id/invoice", protectAdmin, downloadAdminInvoice);
router.get("/my", protect, getMyOrders);
router.get("/my/:id/invoice", protect, downloadMyInvoice);
router.get("/my/:id", protect, getMyOrderById);
router.post("/", protect, createOrder);

export default router;
