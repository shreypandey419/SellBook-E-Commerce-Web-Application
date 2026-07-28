import { useEffect, useState } from "react";
import { FaFileDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import apiClient from "../api/client";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState("");
  useEffect(() => { apiClient.get("/api/orders/my").then(({ data }) => setOrders(data.data?.orders || [])).catch(() => toast.error("Unable to load orders.")).finally(() => setLoading(false)); }, []);
  const downloadInvoice = async (order) => { setDownloadingId(order._id); try { const response = await apiClient.get(`/api/orders/my/${order._id}/invoice`, { responseType: "blob" }); const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })); const link = document.createElement("a"); link.href = url; link.download = `invoice-${order.orderId}.pdf`; link.click(); URL.revokeObjectURL(url); } catch { toast.error("Unable to download invoice."); } finally { setDownloadingId(""); } };
  if (loading) return <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />;
  return <div className="mx-auto max-w-5xl"><h1 className="text-3xl font-black">My Orders</h1>{orders.length === 0 ? <p className="mt-6 rounded-2xl bg-white p-8 text-slate-500">You have not placed any orders yet.</p> : <div className="mt-6 space-y-4">{orders.map((order) => <article key={order._id} className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-bold">{order.orderId}</p><p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p></div><div className="text-right"><p className="font-bold">₹{order.finalAmount}</p><p className="text-sm text-indigo-600">{order.orderStatus} · {order.paymentStatus}</p></div></div><p className="mt-3 text-sm text-slate-600">{order.books.map((item) => `${item.title} × ${item.quantity}`).join(", ")}</p><button type="button" onClick={() => downloadInvoice(order)} disabled={downloadingId === order._id} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-3 py-2 text-sm font-bold text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"><FaFileDownload />{downloadingId === order._id ? "Preparing…" : "Download Invoice"}</button></article>)}</div>}</div>;
}
export default MyOrdersPage;
