import crypto from "crypto";
import Razorpay from "razorpay";
import Book from "../models/bookModel.js";
import Order from "../models/orderModel.js";
import { sendOrderPlacedEmail } from "../services/emailService.js";
import { reduceInventory } from "../services/inventoryService.js";
import { useCoupon, validateCoupon } from "../services/couponService.js";

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) throw new Error("Payments are not configured.");
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
};

const buildItems = async (items) => {
  if (!Array.isArray(items) || !items.length) throw new Error("Your cart is empty.");
  const ids = items.map((item) => item.id || item._id);
  const books = await Book.find({ _id: { $in: ids } }).lean();
  const byId = new Map(books.map((book) => [book._id.toString(), book]));
  return items.map((item) => {
    const book = byId.get(String(item.id || item._id));
    if (!book || Number(book.stock ?? book.stockQuantity ?? 0) < Number(item.quantity || 1)) throw new Error("One or more books are unavailable.");
    return { book: book._id, title: book.title, author: book.author, image: book.image, price: book.price, quantity: Number(item.quantity || 1) };
  });
};

const totals = (books, discountAmount = 0) => { const totalAmount = books.reduce((sum, item) => sum + item.price * item.quantity, 0); const taxAmount = +((totalAmount - discountAmount) * 0.05).toFixed(2); return { totalAmount, taxAmount, shippingCharge: 0, finalAmount: +(totalAmount - discountAmount + taxAmount).toFixed(2) }; };
const shippingAddress = (address, user) => ({ fullName: address.fullName || user.name, email: user.email, phoneNumber: address.phone || user.phone || "", street: address.street || address.address || "", city: address.city || "", state: address.state || "", zipCode: address.zipCode || address.pincode || "" });

export const createPaymentOrder = async (req, res) => {
  try {
    const books = await buildItems(req.body?.items);
    const subtotal = books.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const couponData = req.body?.couponCode ? await validateCoupon(req.body.couponCode, subtotal) : null;
    const amount = totals(books, couponData?.discountAmount || 0).finalAmount;
    const paymentOrder = await getRazorpay().orders.create({ amount: Math.round(amount * 100), currency: "INR", receipt: `sellbook_${Date.now()}` });
    return res.status(201).json({ success: true, message: "Payment order created.", data: { order: paymentOrder, amount, keyId: process.env.RAZORPAY_KEY_ID } });
  } catch (error) { return res.status(error.message === "Payments are not configured." ? 503 : 400).json({ success: false, message: error.message || "Unable to create payment order." }); }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, address, couponCode } = req.body || {};
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if (!razorpay_signature || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature))) return res.status(400).json({ success: false, message: "Payment verification failed." });
    const books = await buildItems(items);
    const subtotal = books.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const couponData = couponCode ? await validateCoupon(couponCode, subtotal) : null;
    const order = await Order.create({ orderId: `SB-${Date.now()}`, user: req.user._id, books, shippingAddress: shippingAddress(address || {}, req.user), ...totals(books, couponData?.discountAmount || 0), coupon: couponData ? { code: couponData.coupon.code, discountType: couponData.coupon.discountType, discountValue: couponData.coupon.discountValue, discountAmount: couponData.discountAmount } : undefined, paymentMethod: "Online Payment", paymentStatus: "Paid", orderStatus: "Confirmed", razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature });
    try { await reduceInventory(order); if (couponData) await useCoupon(couponData.coupon._id); } catch (inventoryError) { await Order.findByIdAndDelete(order._id); throw inventoryError; }
    await sendOrderPlacedEmail(order);
    return res.status(201).json({ success: true, message: "Payment verified and order created.", data: { order } });
  } catch (error) { return res.status(400).json({ success: false, message: error.message || "Unable to verify payment." }); }
};
