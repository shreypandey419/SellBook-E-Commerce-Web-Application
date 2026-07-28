import { useState } from 'react'
import { useCart } from '../CartContext/CartContext.jsx'

const Checkout = () => {
  const { cart, updateCartItem, removeFromCart, clearCart } = useCart()
  const [formData, setFormData] = useState({ name: '', email: '', address: '', city: '', state: '', zip: '' })
  const [orderSent, setOrderSent] = useState(false)

  const subtotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = +(subtotal * 0.05).toFixed(2)
  const total = +(subtotal + tax).toFixed(2)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!cart.items.length) return
    setOrderSent(true)
    clearCart()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Checkout</h1>
        <p className="text-gray-600">Review your cart and place your order.</p>
      </div>

      {orderSent ? (
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
          <h2 className="text-3xl font-semibold mb-4">Order submitted</h2>
          <p className="text-slate-700 mb-4">Thanks for your purchase! Your order is being processed.</p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-semibold mb-4">Shipping details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: 'name', label: 'Full name' },
                  { name: 'email', label: 'Email' },
                  { name: 'address', label: 'Street address' },
                  { name: 'city', label: 'City' },
                  { name: 'state', label: 'State' },
                  { name: 'zip', label: 'ZIP code' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-5 py-3 text-sm font-semibold hover:bg-slate-800"
                >
                  Place order
                </button>
              </form>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-semibold mb-4">Cart items</h2>
              {cart.items.length ? (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 p-4">
                      <div>
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-600">Qty {item.quantity}</p>
                        <p className="text-sm text-slate-600">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateCartItem({ id: item.id, quantity: item.quantity - 1 })}
                          className="rounded-full border border-slate-300 px-3 py-1"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => updateCartItem({ id: item.id, quantity: item.quantity + 1 })}
                          className="rounded-full border border-slate-300 px-3 py-1"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart({ id: item.id })}
                          className="rounded-full border border-red-200 px-3 py-1 text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">Your cart is empty. Add books from the Books page to continue.</p>
              )}
            </div>
          </section>

          <aside className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">Order summary</h2>
            <div className="space-y-3 text-slate-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-900 border-t border-slate-200 pt-4">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={clearCart}
              disabled={!cart.items.length}
              className="mt-6 w-full rounded-full border border-slate-300 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}

export default Checkout
