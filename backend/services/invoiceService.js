import PDFDocument from "pdfkit";

const money = (value) => `INR ${Number(value || 0).toFixed(2)}`;

export const writeInvoice = (order, response) => {
  const document = new PDFDocument({ margin: 50, size: "A4" });
  const invoiceNumber = `INV-${String(order.orderId).replace(/[^a-zA-Z0-9-]/g, "")}`;
  response.setHeader("Content-Type", "application/pdf");
  response.setHeader("Content-Disposition", `attachment; filename="${invoiceNumber}.pdf"`);
  document.pipe(response);
  document.fillColor("#4338ca").fontSize(25).text("SellBook", { align: "left" });
  document.fillColor("#0f172a").fontSize(10).text("Your reading journey", { align: "left" });
  document.moveDown(2).fontSize(21).text("INVOICE", { align: "right" });
  document.fontSize(10).fillColor("#475569").text(`Invoice Number: ${invoiceNumber}`, { align: "right" }).text(`Order ID: ${order.orderId}`, { align: "right" }).text(`Order Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, { align: "right" });
  document.moveDown(2).fillColor("#0f172a").fontSize(12).text("Bill To");
  document.fontSize(10).fillColor("#475569").text(order.shippingAddress?.fullName || "Customer").text(order.shippingAddress?.email || "").text([order.shippingAddress?.street, order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.zipCode].filter(Boolean).join(", "));
  document.moveDown().fillColor("#0f172a").text(`Payment: ${order.paymentMethod} (${order.paymentStatus})`);
  document.moveDown().fontSize(11).fillColor("#ffffff").rect(50, document.y, 495, 22).fill("#4338ca").fillColor("#ffffff").text("Book", 58, document.y - 16).text("Qty", 350, document.y - 16).text("Unit Price", 395, document.y - 16).text("Total", 485, document.y - 16, { align: "right" });
  order.books.forEach((item) => {
    document.moveDown().fillColor("#0f172a").fontSize(10).text(item.title || "Book", 58).text(String(item.quantity || 1), 350, document.y - 12).text(money(item.price), 395, document.y - 12).text(money(Number(item.price || 0) * Number(item.quantity || 1)), 455, document.y - 12, { width: 82, align: "right" });
  });
  document.moveDown(2).fontSize(11).text(`Subtotal: ${money(order.totalAmount)}`, { align: "right" });
  if (order.coupon?.discountAmount) document.text(`Coupon discount: -${money(order.coupon.discountAmount)}`, { align: "right" });
  document.font("Helvetica-Bold").fontSize(13).text(`Total Amount: ${money(order.finalAmount)}`, { align: "right" });
  document.font("Helvetica").fillColor("#64748b").fontSize(9).text("Thank you for choosing SellBook.", 50, 760, { align: "center", width: 495 });
  document.end();
};
