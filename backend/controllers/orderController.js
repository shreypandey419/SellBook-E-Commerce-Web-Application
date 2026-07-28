import Order from "../models/orderModel.js";
import mongoose from "mongoose";
import {
  sendCancelledEmail,
  sendDeliveredEmail,
  sendOrderConfirmedEmail,
  sendOrderPlacedEmail,
  sendProcessingEmail,
} from "../services/emailService.js";
import { ensureInventory, reduceInventory, restoreInventory } from "../services/inventoryService.js";
import { useCoupon, validateCoupon } from "../services/couponService.js";
import { writeInvoice } from "../services/invoiceService.js";

const allowedOrderStatuses = ["Pending", "Confirmed", "Processing", "Delivered", "Cancelled"];
const allowedStatusTransitions = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Processing", "Cancelled"],
  Processing: ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
  // Keeps existing records compatible while preventing new Shipped transitions.
  Shipped: ["Delivered", "Cancelled"],
};

export const createOrder = async (req, res, next) => {
  try {
    const {
      customer = {},
      items = [],
      paymentMethod = "Cash on Delivery",
      notes = "",
      deliveryDate = null,
    } = req.body || {};

    await ensureInventory(items);

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
    let couponData = null;
    if (req.body?.couponCode) couponData = await validateCoupon(req.body.couponCode, totalAmount);
    const discountAmount = couponData?.discountAmount || 0;
    const taxAmount = +((totalAmount - discountAmount) * 0.05).toFixed(2);
    const shippingCharge = 0;

    const order = await Order.create({
      orderId: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user: req.user?.id || null,
      shippingAddress: {
        fullName: customer.name || "",
        email: customer.email || "",
        phoneNumber: customer.phone || "",
        street: customer.address?.street || "",
        city: customer.address?.city || "",
        state: customer.address?.state || "",
        zipCode: customer.address?.zip || "",
      },
      books: items.map((item) => ({
        book: mongoose.isValidObjectId(item.id || item._id) ? item.id || item._id : null,
        title: item.title || item.name || "",
        author: item.author || "",
        image: item.image || "",
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
      })),
      shippingCharge,
      totalAmount,
      taxAmount,
      finalAmount: +(totalAmount - discountAmount + taxAmount + shippingCharge).toFixed(2),
      coupon: couponData ? { code: couponData.coupon.code, discountType: couponData.coupon.discountType, discountValue: couponData.coupon.discountValue, discountAmount } : undefined,
      paymentMethod,
      paymentStatus: paymentMethod === "Online Payment" ? "Paid" : "Unpaid",
      notes,
      deliveryDate,
      orderStatus: "Pending",
    });

    try {
      await reduceInventory(order);
      if (couponData) await useCoupon(couponData.coupon._id);
    } catch (inventoryError) {
      await Order.findByIdAndDelete(order._id);
      return res.status(400).json({ success: false, message: inventoryError.message });
    }
    await sendOrderPlacedEmail(order);

    return res.status(201).json({ success: true, order });
  } catch (error) {
    if (
      error.message?.includes("unavailable") ||
      error.message?.includes("stock") ||
      error.message?.includes("quantity")
    ) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    const counts = orders.reduce(
      (accumulator, order) => {
        accumulator.totalOrders += 1;
        const status = order.orderStatus.toLowerCase();
        if (accumulator[status] !== undefined) accumulator[status] += 1;
        if (order.paymentStatus === "Unpaid") accumulator.pendingPayment += 1;
        return accumulator;
      },
      { totalOrders: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0, pendingPayment: 0 }
    );

    return res.status(200).json({ success: true, counts, orders });
  } catch (error) {
    return next(error);
  }
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  return res.status(200).json({ success: true, message: "Orders loaded.", data: { orders } });
};

export const getMyOrderById = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).lean();
  if (!order) return res.status(404).json({ success: false, message: "Order not found." });
  return res.status(200).json({ success: true, message: "Order loaded.", data: { order } });
};

export const downloadMyInvoice = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).lean();
  if (!order) return res.status(404).json({ success: false, message: "Order not found." });
  return writeInvoice(order, res);
};

export const downloadAdminInvoice = async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) return res.status(404).json({ success: false, message: "Order not found." });
  return writeInvoice(order, res);
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body || {};

  if (!allowedOrderStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Please provide a valid order status." });
  }

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid order identifier." });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

    if (order.orderStatus === status) {
      return res.status(200).json({ success: true, message: "Order status is already up to date.", order });
    }

    if (!allowedStatusTransitions[order.orderStatus]?.includes(status)) {
      return res.status(400).json({ success: false, message: `An order cannot move from ${order.orderStatus} to ${status}.` });
    }

    order.orderStatus = status;
    if (status === "Delivered") order.deliveredAt = new Date();
    if (status === "Cancelled") await restoreInventory(order);
    await order.save();

    const statusEmail = {
      Confirmed: sendOrderConfirmedEmail,
      Processing: sendProcessingEmail,
      Delivered: sendDeliveredEmail,
      Cancelled: sendCancelledEmail,
    }[status];
    if (statusEmail) await statusEmail(order);

    return res.status(200).json({ success: true, message: "Order status updated successfully.", order });
  } catch (_error) {
    return res.status(500).json({ success: false, message: "Unable to update the order status." });
  }
};
