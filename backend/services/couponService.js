import Coupon from "../models/couponModel.js";

export const getCouponDiscount = (coupon, subtotal) => {
  const amount = coupon.discountType === "percentage" ? subtotal * (coupon.discountValue / 100) : coupon.discountValue;
  return Math.min(Math.max(0, Number(amount.toFixed(2))), subtotal);
};

export const validateCoupon = async (code, subtotal) => {
  const normalizedCode = String(code || "").trim().toUpperCase();
  if (!normalizedCode) throw new Error("Enter a coupon code.");
  const coupon = await Coupon.findOne({ code: normalizedCode });
  if (!coupon || !coupon.active) throw new Error("This coupon is not available.");
  if (coupon.expiryDate < new Date()) throw new Error("This coupon has expired.");
  if (coupon.usedCount >= coupon.usageLimit) throw new Error("This coupon has reached its usage limit.");
  if (subtotal < coupon.minimumOrder) throw new Error(`This coupon requires a minimum order of ₹${coupon.minimumOrder}.`);
  return { coupon, discountAmount: getCouponDiscount(coupon, subtotal) };
};

export const useCoupon = async (couponId) => {
  const updated = await Coupon.findOneAndUpdate(
    { _id: couponId, active: true, expiryDate: { $gte: new Date() }, $expr: { $lt: ["$usedCount", "$usageLimit"] } },
    { $inc: { usedCount: 1 } },
    { new: true }
  );
  if (!updated) throw new Error("This coupon is no longer available.");
  return updated;
};
