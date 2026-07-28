import Coupon from "../models/couponModel.js";
import { validateCoupon } from "../services/couponService.js";

const couponInput = (body) => ({
  code: String(body.code || "").trim().toUpperCase(),
  description: String(body.description || "").trim(),
  discountType: body.discountType,
  discountValue: Number(body.discountValue),
  minimumOrder: Number(body.minimumOrder || 0),
  expiryDate: body.expiryDate,
  usageLimit: Number(body.usageLimit),
  active: body.active !== false,
});

const validateInput = (input) => {
  if (!input.code || !["percentage", "fixed"].includes(input.discountType) || !Number.isFinite(input.discountValue) || input.discountValue <= 0 || !input.expiryDate || !Number.isFinite(input.usageLimit) || input.usageLimit < 1) return "Please provide valid coupon details.";
  if (input.discountType === "percentage" && input.discountValue > 100) return "Percentage discounts cannot exceed 100%.";
  return "";
};

export const listCoupons = async (_req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return res.status(200).json({ success: true, coupons });
};

export const createCoupon = async (req, res) => {
  const input = couponInput(req.body || {}); const message = validateInput(input);
  if (message) return res.status(400).json({ success: false, message });
  try { const coupon = await Coupon.create(input); return res.status(201).json({ success: true, coupon }); }
  catch (error) { return res.status(error.code === 11000 ? 409 : 500).json({ success: false, message: error.code === 11000 ? "Coupon code already exists." : "Unable to create coupon." }); }
};

export const updateCoupon = async (req, res) => {
  const input = couponInput(req.body || {}); const message = validateInput(input);
  if (message) return res.status(400).json({ success: false, message });
  try { const coupon = await Coupon.findByIdAndUpdate(req.params.id, input, { new: true, runValidators: true }); if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found." }); return res.status(200).json({ success: true, coupon }); }
  catch (error) { return res.status(error.code === 11000 ? 409 : 500).json({ success: false, message: error.code === 11000 ? "Coupon code already exists." : "Unable to update coupon." }); }
};

export const deleteCoupon = async (req, res) => { const coupon = await Coupon.findByIdAndDelete(req.params.id); if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found." }); return res.status(200).json({ success: true, message: "Coupon deleted." }); };
export const toggleCoupon = async (req, res) => { const coupon = await Coupon.findByIdAndUpdate(req.params.id, { active: Boolean(req.body?.active) }, { new: true }); if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found." }); return res.status(200).json({ success: true, coupon }); };
export const checkCoupon = async (req, res) => { try { const subtotal = Number(req.body?.subtotal); if (!Number.isFinite(subtotal) || subtotal < 0) return res.status(400).json({ success: false, message: "A valid cart subtotal is required." }); const { coupon, discountAmount } = await validateCoupon(req.body?.code, subtotal); return res.status(200).json({ success: true, coupon: { code: coupon.code, description: coupon.description, discountType: coupon.discountType, discountValue: coupon.discountValue }, discountAmount }); } catch (error) { return res.status(400).json({ success: false, message: error.message }); } };
