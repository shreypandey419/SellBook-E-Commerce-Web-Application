import express from "express";
import { checkCoupon, createCoupon, deleteCoupon, listCoupons, toggleCoupon, updateCoupon } from "../controllers/couponController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/validate", protect, checkCoupon);
router.post("/apply", protect, checkCoupon);
router.get("/", protectAdmin, listCoupons);
router.post("/", protectAdmin, createCoupon);
router.put("/:id", protectAdmin, updateCoupon);
router.delete("/:id", protectAdmin, deleteCoupon);
router.patch("/:id/active", protectAdmin, toggleCoupon);
export default router;
