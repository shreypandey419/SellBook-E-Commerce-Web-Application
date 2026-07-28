import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", default: null },
    title: { type: String, trim: true, default: "" },
    author: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    price: { type: Number, min: 0, default: 0 },
    quantity: { type: Number, min: 1, default: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    shippingAddress: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      phoneNumber: { type: String, default: "" },
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
    },
    books: { type: [orderItemSchema], default: [] },
    shippingCharge: { type: Number, min: 0, default: 0 },
    coupon: {
      code: { type: String, default: "" },
      discountType: { type: String, enum: ["percentage", "fixed", ""], default: "" },
      discountValue: { type: Number, min: 0, default: 0 },
      discountAmount: { type: Number, min: 0, default: 0 },
    },
    totalAmount: { type: Number, min: 0, required: true },
    taxAmount: { type: Number, min: 0, required: true },
    finalAmount: { type: Number, min: 0, required: true },
    paymentMethod: {
      type: String,
      enum: ["Online Payment", "Cash on Delivery"],
      default: "Cash on Delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },
    razorpayOrderId: { type: String, default: "", index: true },
    razorpayPaymentId: { type: String, default: "", index: true },
    razorpaySignature: { type: String, default: "" },
    notes: { type: String, default: "" },
    deliveryDate: { type: Date, default: null },
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    deliveredAt: { type: Date, default: null },
    inventoryAdjusted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
