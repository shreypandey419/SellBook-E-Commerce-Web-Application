import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { FaBook, FaChartLine, FaCheckCircle, FaClock, FaDownload, FaExclamationTriangle, FaShoppingBag } from "react-icons/fa";
import apiClient from "../../api/client";
import DashboardCard from "./DashboardCard";
import ChartCard from "./ChartCard";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

function DashboardSkeleton() {
  return <div className="space-y-6">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-200" />)}</div>;
}

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await apiClient.get("/api/admin/dashboard");
        setDashboard(data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load dashboard data.");
      }
    };

    loadDashboard();
  }, []);

  const activity = useMemo(() => {
    if (!dashboard) return [];

    return [
      ...dashboard.latestBooks.map((book) => ({ id: `book-${book._id}`, label: `Added “${book.title}”`, date: book.createdAt, type: "Book" })),
      ...dashboard.latestOrders.map((order) => ({ id: `order-${order._id}`, label: `Order #${order.orderId} was placed`, date: order.createdAt, type: "Order" })),
    ].sort((first, second) => new Date(second.date) - new Date(first.date)).slice(0, 5);
  }, [dashboard]);

  const exportSalesCsv = () => {
    const rows = [["Order ID", "Customer", "Status", "Amount", "Date"], ...(dashboard?.recentSales || []).map((order) => [order.orderId, order.shippingAddress?.fullName || "", order.orderStatus, order.finalAmount, new Date(order.createdAt).toLocaleDateString()])];
    const url = URL.createObjectURL(new Blob([rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n")], { type: "text/csv" }));
    const link = document.createElement("a"); link.href = url; link.download = "sellbook-sales.csv"; link.click(); URL.revokeObjectURL(url);
  };

  if (!dashboard && !error) return <DashboardSkeleton />;

  if (error) {
    return <div className="rounded-2xl bg-red-50 p-6 text-red-700">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm font-medium text-blue-600">SELLBOOK OVERVIEW</p><h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1><p className="mt-1 text-slate-600">A clear view of your store’s performance.</p></div>
        <div className="flex flex-wrap gap-2"><Link to="/add-book" className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700">Add Book</Link><Link to="/list-books" className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">View Books</Link><Link to="/orders" className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">View Orders</Link><button type="button" onClick={exportSalesCsv} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"><FaDownload />Export CSV</button></div>
      </Motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardCard icon={FaBook} label="Total Books" value={dashboard.totalBooks} />
        <DashboardCard icon={FaShoppingBag} label="Total Orders" value={dashboard.totalOrders} accent="indigo" />
        <DashboardCard icon={FaChartLine} label="Revenue" value={formatCurrency(dashboard.totalRevenue)} accent="emerald" />
        <DashboardCard icon={FaClock} label="Pending Orders" value={dashboard.pendingOrders} accent="amber" />
        <DashboardCard icon={FaCheckCircle} label="Delivered Orders" value={dashboard.deliveredOrders} accent="green" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard icon={FaChartLine} label="Average Order Value" value={formatCurrency(dashboard.averageOrderValue)} accent="indigo" />
        <DashboardCard icon={FaBook} label="Total Stock" value={dashboard.totalStock} accent="emerald" />
        <DashboardCard icon={FaExclamationTriangle} label="Low Stock" value={dashboard.lowStockCount} accent="amber" />
        <DashboardCard icon={FaExclamationTriangle} label="Out of Stock" value={dashboard.outOfStockCount} accent="red" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <ChartCard title="Monthly Books Added" data={dashboard.monthlyBooks} />
        <ChartCard title="Monthly Orders" data={dashboard.monthlyOrders} />
        <ChartCard title="Monthly Revenue" data={dashboard.monthlyRevenue} formatValue={formatCurrency} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-lg shadow-slate-200/50 backdrop-blur"><h2 className="font-semibold text-slate-900">Latest Books</h2>{dashboard.latestBooks.length === 0 ? <p className="py-8 text-center text-slate-500">No books have been added yet.</p> : <div className="mt-4 space-y-3">{dashboard.latestBooks.map((book) => <div key={book._id} className="flex items-center gap-3"><div className="h-12 w-9 overflow-hidden rounded bg-slate-100">{book.image && <img src={book.image} alt="" className="h-full w-full object-cover" />}</div><div className="min-w-0 flex-1"><p className="truncate font-medium text-slate-800">{book.title}</p><p className="text-sm text-slate-500">{book.author} · {book.category}</p></div><span className="font-medium text-slate-700">{formatCurrency(book.price)}</span></div>)}</div>}</section>
        <section className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-lg shadow-slate-200/50 backdrop-blur"><h2 className="font-semibold text-slate-900">Latest Orders</h2>{dashboard.latestOrders.length === 0 ? <p className="py-8 text-center text-slate-500">No orders have been placed yet.</p> : <div className="mt-4 space-y-3">{dashboard.latestOrders.map((order) => <div key={order._id} className="flex items-center justify-between gap-3"><div><p className="font-medium text-slate-800">#{order.orderId}</p><p className="text-sm text-slate-500">{order.shippingAddress?.fullName || "Guest customer"}</p></div><div className="text-right"><p className="font-medium text-slate-800">{formatCurrency(order.finalAmount)}</p><p className="text-sm text-slate-500">{order.orderStatus}</p></div></div>)}</div>}</section>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-lg shadow-slate-200/50 backdrop-blur"><h2 className="font-semibold text-slate-900">Top Selling Books</h2>{dashboard.topBooks?.length ? <div className="mt-4 space-y-3">{dashboard.topBooks.map((book) => <div key={book._id} className="flex justify-between gap-3"><span className="truncate text-slate-700">{book._id}</span><span className="shrink-0 font-semibold">{book.quantity} sold</span></div>)}</div> : <p className="py-6 text-slate-500">No sales yet.</p>}</section>
        <section className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-lg shadow-slate-200/50 backdrop-blur"><h2 className="font-semibold text-slate-900">Top Categories</h2>{dashboard.topCategories?.length ? <div className="mt-4 space-y-3">{dashboard.topCategories.map((category) => <div key={category._id} className="flex justify-between gap-3"><span className="text-slate-700">{category._id}</span><span className="shrink-0 font-semibold">{formatCurrency(category.revenue)}</span></div>)}</div> : <p className="py-6 text-slate-500">No sales yet.</p>}</section>
        <section className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-lg shadow-slate-200/50 backdrop-blur"><h2 className="font-semibold text-slate-900">Best Customers</h2>{dashboard.bestCustomers?.length ? <div className="mt-4 space-y-3">{dashboard.bestCustomers.map((customer) => <div key={customer._id} className="flex justify-between gap-3"><span className="truncate text-slate-700">{customer.name || customer._id}</span><span className="shrink-0 font-semibold">{formatCurrency(customer.total)}</span></div>)}</div> : <p className="py-6 text-slate-500">No customers yet.</p>}</section>
      </div>

      <section className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-lg shadow-slate-200/50 backdrop-blur"><h2 className="font-semibold text-slate-900">Recent Activity</h2>{activity.length === 0 ? <p className="py-8 text-center text-slate-500">Activity will appear here as you add books and receive orders.</p> : <div className="mt-4 divide-y divide-slate-100">{activity.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-3"><div><p className="font-medium text-slate-800">{item.label}</p><p className="text-sm text-slate-500">{item.type}</p></div><time className="text-sm text-slate-500">{new Date(item.date).toLocaleDateString()}</time></div>)}</div>}</section>
    </div>
  );
}

export default Dashboard;
