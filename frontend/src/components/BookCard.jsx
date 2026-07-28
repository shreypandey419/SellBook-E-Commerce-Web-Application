import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { useCart } from "../CartContext/CartContext";
import { useWishlist } from "../WishlistContext/WishlistContext";

function BookCard({ book }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const id = book._id || book.id;
  const saved = isInWishlist(id);
  const rating = Number(book.rating || 0);
  const reviewCount = Number(book.reviewCount || 0);
  const stock = Number(book.stock ?? book.stockQuantity ?? 0);

  return <Motion.article whileHover={{ y: -5 }} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"><Link to={`/book/${id}`} className="relative block aspect-[3/4] overflow-hidden bg-slate-100"><div className="absolute inset-0 grid place-items-center text-sm text-slate-400">No cover available</div>{book.image && <img src={book.image} alt={`${book.title} cover`} loading="lazy" className="relative z-10 h-full w-full object-cover transition duration-500 group-hover:scale-105" onError={(event) => { event.currentTarget.style.display = "none"; }} />}<button type="button" onClick={(event) => { event.preventDefault(); toggleWishlist(book); }} aria-label="Toggle wishlist" className={`absolute right-3 top-3 z-20 rounded-full p-2 shadow ${saved ? "bg-red-500 text-white" : "bg-white text-slate-600"}`}><FaHeart /></button></Link><div className="p-4"><p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{book.category || "Book"}</p><Link to={`/book/${id}`} className="mt-2 block truncate text-lg font-bold text-slate-900">{book.title}</Link><p className="mt-1 truncate text-sm text-slate-500">by {book.author}</p><div className="mt-2"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${stock <= 0 ? "bg-rose-50 text-rose-700" : stock <= 5 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{stock <= 0 ? "Out of stock" : stock <= 5 ? `Low stock: ${stock}` : "In stock"}</span></div><div className="mt-3 flex items-center justify-between"><span className="font-bold">₹{Number(book.price || 0).toLocaleString("en-IN")}</span><span className="flex items-center gap-1 text-sm text-amber-500"><FaStar /> {rating ? rating.toFixed(1) : "—"}<span className="text-slate-400">({reviewCount})</span></span></div><button type="button" disabled={stock <= 0} onClick={() => addToCart(book)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"><FaShoppingCart /> {stock <= 0 ? "Out of stock" : "Add to cart"}</button></div></Motion.article>;
}

export default BookCard;
