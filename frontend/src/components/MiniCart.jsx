import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useCart } from "../CartContext/CartContext";
import { FaShoppingCart } from "react-icons/fa";

const MiniCart = ({ closeCart }) => {
  const { cartItems, cartSubtotal, cartCount } = useCart();

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50"
    >
      <div className="p-4">
        <h3 className="font-bold text-lg">My Cart ({cartCount})</h3>
      </div>
      <div className="border-t max-h-60 overflow-y-auto">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border-b">
              <img src={item.image} alt={item.title} className="w-12 h-16 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{item.title}</p>
                <p className="text-sm text-gray-500">{item.quantity} x ₹{item.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 p-8">Your cart is empty.</p>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Subtotal:</span>
            <span className="font-bold text-lg">₹{cartSubtotal.toFixed(2)}</span>
          </div>
          <Link to="/cart" onClick={closeCart} className="w-full bg-blue-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
            <FaShoppingCart /> View Cart
          </Link>
        </div>
      )}
    </Motion.div>
  );
};

export default MiniCart;
