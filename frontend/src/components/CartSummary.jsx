import { Link } from "react-router-dom";
import { useCart } from "../CartContext/CartContext";

const CartSummary = () => {
  const { cartSubtotal } = useCart();
  const shippingFee = cartSubtotal > 500 || cartSubtotal === 0 ? 0 : 40;
  const total = cartSubtotal + shippingFee;

  return (
    <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-24">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{cartSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shippingFee > 0 ? `₹${shippingFee.toFixed(2)}` : "Free"}</span>
        </div>
      </div>
      <div className="flex justify-between font-bold text-lg border-t pt-4">
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
      <Link to="/checkout" className="mt-6 block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700">
        Proceed to Checkout
      </Link>
    </div>
  );
};

export default CartSummary;