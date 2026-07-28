import { Link } from "react-router-dom";
import { useWishlist } from "../WishlistContext/WishlistContext";
import { useCart } from "../CartContext/CartContext";
import { FaTrash, FaShoppingCart } from "react-icons/fa";

const WishlistItem = ({ item }) => {
  const { toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
    toggleWishlist(item); // Optionally remove from wishlist after adding to cart
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <Link to={`/book/${item.id}`}>
        <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded mb-4" />
        <h3 className="font-bold truncate">{item.title}</h3>
      </Link>
      <p className="text-gray-600 text-sm">{item.author}</p>
      <div className="mt-auto pt-4 flex justify-between items-center">
        <button onClick={() => toggleWishlist(item)} className="text-gray-400 hover:text-red-500" aria-label="Remove from wishlist"><FaTrash /></button>
        <button onClick={handleAddToCart} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-200" aria-label="Add to cart"><FaShoppingCart /></button>
      </div>
    </div>
  );
};

export default WishlistItem;
