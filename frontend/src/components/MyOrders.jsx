import { useMemo, useState } from 'react'

const sampleOrders = [
  {
    _id: 'order-1',
    orderId: 'SB-11234',
    placedAt: '2026-04-10T12:15:00Z',
    finalAmount: 1099,
    paymentMethod: 'Online Payment',
    orderStatus: 'Processing',
  },
  {
    _id: 'order-2',
    orderId: 'SB-11235',
    placedAt: '2026-04-08T09:30:00Z',
    finalAmount: 589,
    paymentMethod: 'Cash on Delivery',
    orderStatus: 'Delivered',
  },
]

const statusClasses = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

const MyOrders = () => {
  const [orders] = useState(sampleOrders)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const sortedOrders = useMemo(() => {
    if (!sortConfig.key) return orders
    return [...orders].sort((a, b) => {
      const aVal = sortConfig.key === 'placedAt' ? new Date(a[sortConfig.key]) : a[sortConfig.key]
      const bVal = sortConfig.key === 'placedAt' ? new Date(b[sortConfig.key]) : b[sortConfig.key]
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      return 0
    })
  }, [orders, sortConfig])

  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600">Track your recent purchases and order status.</p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-950 text-white">
            <tr>
              {[
                { key: 'orderId', label: 'Order ID' },
                { key: 'placedAt', label: 'Placed' },
                { key: 'finalAmount', label: 'Amount' },
                { key: 'paymentMethod', label: 'Payment' },
                { key: 'orderStatus', label: 'Status' },
              ].map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold tracking-wide"
                >
                  <button type="button" onClick={() => toggleSort(col.key)} className="inline-flex items-center gap-2">
                    {col.label}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {sortedOrders.map((order) => (
              <tr key={order._id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.orderId}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{new Date(order.placedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-slate-900">₹{order.finalAmount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{order.paymentMethod}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!sortedOrders.length && (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          No orders yet. Shop our books and checkout to place an order.
        </div>
      )}
    </div>
  )
}

export default MyOrders
