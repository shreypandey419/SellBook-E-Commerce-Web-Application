import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });

  return transporter;
};

const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatDate = (date) => new Date(date || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
const escapeHtml = (value) => String(value || "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);

const orderItems = (books = []) => books.map((book) => `<tr><td style="padding:12px 0;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;">${escapeHtml(book.title)}</td><td style="padding:12px 8px;border-bottom:1px solid #e2e8f0;color:#64748b;text-align:center;">× ${Number(book.quantity || 1)}</td><td style="padding:12px 0;border-bottom:1px solid #e2e8f0;color:#0f172a;text-align:right;">${formatCurrency(Number(book.price || 0) * Number(book.quantity || 1))}</td></tr>`).join("");

const emailLayout = ({ title, intro, order, ctaLabel = "View your orders" }) => {
  const customerName = escapeHtml(order.shippingAddress?.fullName || "Reader");
  const orderUrl = process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL.replace(/\/$/, "")}/orders` : "";
  const cta = orderUrl ? `<a href="${orderUrl}" style="display:inline-block;background:#4f46e5;border-radius:10px;color:#ffffff;font-weight:700;padding:13px 22px;text-decoration:none;">${ctaLabel}</a>` : "";

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f8fafc;color:#0f172a;font-family:Arial,Helvetica,sans-serif;"><div style="margin:0 auto;max-width:640px;padding:32px 16px;"><div style="overflow:hidden;border-radius:20px;background:#ffffff;box-shadow:0 10px 28px rgba(15,23,42,.08);"><div style="background:linear-gradient(135deg,#0f172a,#4338ca);padding:32px;color:#ffffff;"><div style="font-size:26px;font-weight:800;letter-spacing:-.5px;">SellBook</div><div style="margin-top:12px;color:#c7d2fe;font-size:14px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Your reading journey</div></div><div style="padding:32px;"><h1 style="margin:0 0 14px;font-size:26px;line-height:1.25;">${title}</h1><p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6;">Hi ${customerName}, ${intro}</p><div style="border:1px solid #e2e8f0;border-radius:14px;padding:20px;"><div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;"><div><div style="color:#64748b;font-size:12px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;">Order ID</div><div style="margin-top:5px;font-weight:800;">${escapeHtml(order.orderId)}</div></div><div><div style="color:#64748b;font-size:12px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;">Order date</div><div style="margin-top:5px;font-weight:700;">${formatDate(order.createdAt)}</div></div></div><div style="margin-top:18px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;"><span style="color:#475569;">Payment method</span><strong>${escapeHtml(order.paymentMethod || "Cash on Delivery")}</strong></div><table style="margin-top:16px;border-collapse:collapse;width:100%;font-size:14px;"><tbody>${orderItems(order.books)}</tbody></table><div style="margin-top:18px;display:flex;justify-content:space-between;gap:16px;font-size:17px;"><strong>Total amount</strong><strong>${formatCurrency(order.finalAmount)}</strong></div></div><div style="margin-top:26px;text-align:center;">${cta}</div></div><div style="border-top:1px solid #e2e8f0;padding:22px 32px;color:#64748b;font-size:13px;line-height:1.5;text-align:center;">Thank you for choosing SellBook.<br>We&apos;re here to help with every chapter.</div></div></div></body></html>`;
};

const sendOrderNotification = async ({ order, subject, title, intro }) => {
  try {
    const activeTransporter = getTransporter();
    const recipient = order?.shippingAddress?.email;
    if (!activeTransporter || !recipient) return false;

    await activeTransporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipient,
      subject,
      html: emailLayout({ order, title, intro }),
      text: `${title}\n\nHi ${order.shippingAddress?.fullName || "Reader"}, ${intro}\n\nOrder ID: ${order.orderId}\nTotal: ${formatCurrency(order.finalAmount)}`,
    });
    return true;
  } catch (error) {
    console.error("Unable to send SellBook order email:", error.message);
    return false;
  }
};

export const sendOrderPlacedEmail = (order) => sendOrderNotification({
  order,
  subject: "Order Confirmed - SellBook",
  title: "Your order has been placed",
  intro: "we have received your order and will keep you updated as it moves through our store.",
});

export const sendOrderConfirmedEmail = (order) => sendOrderNotification({
  order,
  subject: "Your Order is Confirmed",
  title: "Your order is confirmed",
  intro: "your order has been confirmed and is next in line for preparation.",
});

export const sendProcessingEmail = (order) => sendOrderNotification({
  order,
  subject: "Your Order is Being Prepared",
  title: "Your books are being prepared",
  intro: "our team is carefully preparing your order for dispatch.",
});

export const sendDeliveredEmail = (order) => sendOrderNotification({
  order,
  subject: "Your Order Has Been Delivered",
  title: "Your order has been delivered",
  intro: "your order has been marked as delivered. We hope you enjoy every page.",
});

export const sendCancelledEmail = (order) => sendOrderNotification({
  order,
  subject: "Your Order Has Been Cancelled",
  title: "Your order has been cancelled",
  intro: "your order has been cancelled. Please contact us if you need any assistance.",
});
