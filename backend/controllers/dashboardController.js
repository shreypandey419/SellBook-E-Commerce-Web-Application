import Book from "../models/bookModel.js";
import Order from "../models/orderModel.js";

const createMonthlySeries = (aggregation, months) => {
  const valuesByMonth = new Map(aggregation.map((item) => [item._id, item.value]));
  return months.map(({ key, label }) => ({ label, value: valuesByMonth.get(key) || 0 }));
};

const getRecentMonths = () => {
  const months = [];
  const cursor = new Date();
  cursor.setDate(1);
  cursor.setHours(0, 0, 0, 0);

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(cursor.getFullYear(), cursor.getMonth() - index, 1);
    months.push({
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: date.toLocaleString("en-US", { month: "short" }),
    });
  }

  return months;
};

const monthlyAggregation = (startDate, valueExpression) => [
  { $match: { createdAt: { $gte: startDate } } },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
      value: { $sum: valueExpression },
    },
  },
];

export const getDashboard = async (_req, res) => {
  try {
    const months = getRecentMonths();
    const startDate = new Date(`${months[0].key}-01T00:00:00.000Z`);
    const [
      totalBooks,
      totalOrders,
      revenue,
      pendingOrders,
      deliveredOrders,
      latestBooks,
      latestOrders,
      bookAggregation,
      orderAggregation,
      revenueAggregation,
      topBooks,
      topCategories,
      bestCustomers,
      totalStock,
      lowStockCount,
      outOfStockCount,
    ] = await Promise.all([
      Book.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $match: { orderStatus: { $ne: "Cancelled" } } }, { $group: { _id: null, value: { $sum: "$finalAmount" } } }]),
      Order.countDocuments({ orderStatus: "Pending" }),
      Order.countDocuments({ orderStatus: "Delivered" }),
      Book.find().sort({ createdAt: -1 }).limit(5).lean(),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
      Book.aggregate(monthlyAggregation(startDate, 1)),
      Order.aggregate(monthlyAggregation(startDate, 1)),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, orderStatus: { $ne: "Cancelled" } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, value: { $sum: "$finalAmount" } } },
      ]),
      Order.aggregate([{ $match: { orderStatus: { $ne: "Cancelled" } } }, { $unwind: "$books" }, { $group: { _id: "$books.title", quantity: { $sum: "$books.quantity" }, revenue: { $sum: { $multiply: ["$books.price", "$books.quantity"] } } } }, { $sort: { quantity: -1 } }, { $limit: 5 }]),
      Order.aggregate([{ $match: { orderStatus: { $ne: "Cancelled" } } }, { $unwind: "$books" }, { $lookup: { from: "books", localField: "books.book", foreignField: "_id", as: "book" } }, { $unwind: { path: "$book", preserveNullAndEmptyArrays: true } }, { $group: { _id: { $ifNull: ["$book.category", "Uncategorised"] }, quantity: { $sum: "$books.quantity" }, revenue: { $sum: { $multiply: ["$books.price", "$books.quantity"] } } } }, { $sort: { revenue: -1 } }, { $limit: 5 }]),
      Order.aggregate([{ $match: { orderStatus: { $ne: "Cancelled" } } }, { $group: { _id: "$shippingAddress.email", name: { $first: "$shippingAddress.fullName" }, orders: { $sum: 1 }, total: { $sum: "$finalAmount" } } }, { $sort: { total: -1 } }, { $limit: 5 }]),
      Book.aggregate([{ $group: { _id: null, value: { $sum: { $ifNull: ["$stock", "$stockQuantity"] } } } }]),
      Book.countDocuments({ $expr: { $and: [{ $gt: [{ $ifNull: ["$stock", "$stockQuantity"] }, 0] }, { $lte: [{ $ifNull: ["$stock", "$stockQuantity"] }, 5] }] } }),
      Book.countDocuments({ $expr: { $lte: [{ $ifNull: ["$stock", "$stockQuantity"] }, 0] } }),
    ]);

    return res.status(200).json({
      success: true,
      totalBooks,
      totalOrders,
      totalRevenue: revenue[0]?.value || 0,
      pendingOrders,
      deliveredOrders,
      latestBooks,
      latestOrders,
      monthlyBooks: createMonthlySeries(bookAggregation, months),
      monthlyOrders: createMonthlySeries(orderAggregation, months),
      monthlyRevenue: createMonthlySeries(revenueAggregation, months),
      averageOrderValue: totalOrders ? (revenue[0]?.value || 0) / totalOrders : 0,
      topBooks,
      topCategories,
      recentSales: latestOrders,
      bestCustomers,
      totalStock: totalStock[0]?.value || 0,
      lowStockCount,
      outOfStockCount,
    });
  } catch (_error) {
    return res.status(500).json({ success: false, message: "Unable to load dashboard data." });
  }
};
