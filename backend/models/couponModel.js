import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true, uppercase: true, index: true },
    description: { type: String, trim: true, default: "" },
    discountType: { type: String, required: true, enum: ["percentage", "fixed"] },
    discountValue: { type: Number, required: true, min: 0 },
    minimumOrder: { type: Number, min: 0, default: 0 },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, min: 1, default: 1 },
    usedCount: { type: Number, min: 0, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default Coupon;
