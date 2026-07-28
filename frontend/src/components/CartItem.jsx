import { useCart } from "../CartContext/CartContext";
import { FaTrash } from "react-icons/fa";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <img src={item.image} alt={item.title} className="w-20 h-28 object-cover rounded" />
      <div className="flex-1">
        <h3 className="font-bold">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.author}</p>
        <p className="font-semibold text-blue-600 mt-1">₹{item.price}</p>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="number"
          value={item.quantity}
          onChange={handleQuantityChange}
          min="1"
          className="w-16 p-2 border rounded-md text-center"
        />
        <p className="font-bold w-24 text-right">₹{(item.price * item.quantity).toFixed(2)}</p>
        <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 p-2" aria-label="Remove item">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
