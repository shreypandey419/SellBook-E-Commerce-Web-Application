import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaHeart, FaMinus, FaPlus, FaShareAlt, FaShoppingCart, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import apiClient from "../api/client";
import { useAuthContext } from "../api/AuthContext";
import { useCart } from "../CartContext/CartContext";
import { useWishlist } from "../WishlistContext/WishlistContext";
import BookCard from "./BookCard";

const emptyReview = { rating: 5, comment: "" };
const reviewUserId = (review) => review.user?._id || review.user;

function RatingStars({ rating, interactive = false, onChange }) {
  return <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" disabled={!interactive} onClick={() => onChange?.(value)} className={interactive ? "rounded p-1 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400" : "cursor-default"} aria-label={interactive ? `Rate ${value} stars` : undefined}><FaStar className={value <= rating ? "text-amber-400" : "text-slate-200"} /></button>)}
  </div>;
}

function BookDetailsPage() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [book, setBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState(emptyReview);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isItemInWishlist } = useWishlist();

  const refreshBook = useCallback(async () => {
    const response = await apiClient.get(`/api/books/${id}`);
    setBook(response.data.book || response.data.data?.book);
  }, [id]);

  const loadReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const response = await apiClient.get(`/api/books/${id}/reviews`);
      setReviews(response.data.reviews || response.data.data?.reviews || []);
    } catch {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    Promise.all([refreshBook(), apiClient.get("/api/books")])
      .then(([, list]) => setBooks(list.data.books || list.data.data?.books || []))
      .catch(() => setBook(null))
      .finally(() => setLoading(false));
    loadReviews();
  }, [id, loadReviews, refreshBook]);

  const currentUserId = user?._id || user?.id;
  const ownReview = useMemo(() => reviews.find((review) => String(reviewUserId(review)) === String(currentUserId)), [currentUserId, reviews]);
  const relatedBooks = useMemo(() => books.filter((item) => item._id !== id && item.category === book?.category).slice(0, 4), [book?.category, books, id]);

  useEffect(() => {
    setReviewForm(ownReview ? { rating: ownReview.rating, comment: ownReview.comment } : emptyReview);
  }, [ownReview]);

  const submitReview = async (event) => {
    event.preventDefault();
    const rating = Number(reviewForm.rating);
    const comment = reviewForm.comment.trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return toast.error("Please select a rating from 1 to 5.");
    if (!comment) return toast.error("Please write a review comment.");

    setReviewSubmitting(true);
    try {
      if (ownReview) {
        await apiClient.put(`/api/reviews/${ownReview._id}`, { rating, comment });
        toast.success("Review updated successfully.");
      } else {
        await apiClient.post("/api/reviews", { bookId: id, rating, comment });
        toast.success("Review added successfully.");
      }
      await Promise.all([loadReviews(), refreshBook()]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save your review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const removeReview = async () => {
    if (!ownReview || !window.confirm("Delete your review?")) return;
    try {
      await apiClient.delete(`/api/reviews/${ownReview._id}`);
      toast.success("Review deleted successfully.");
      await Promise.all([loadReviews(), refreshBook()]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete your review.");
    }
  };

  if (loading) return <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />;
  if (!book) return <div className="py-20 text-center"><h1 className="text-3xl font-black">Book not found</h1><Link to="/" className="mt-4 inline-block text-indigo-600">Return home</Link></div>;

  const inWishlist = isItemInWishlist(book._id);
  const availableStock = Number(book.stock ?? book.stockQuantity ?? 0);
  const available = availableStock > 0;
  const averageRating = Number(book.rating || 0);
  const reviewCount = Number(book.reviewCount || 0);

  return <div className="mx-auto max-w-7xl"><Link to="/" className="text-sm font-semibold text-indigo-600">← Back to books</Link><section className="mt-6 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]"><div className="aspect-[3/4] overflow-hidden rounded-3xl bg-slate-100">{book.image ? <img src={book.image} alt={`${book.title} cover`} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <div className="grid h-full place-items-center text-slate-400">No cover available</div>}</div><div><p className="text-sm font-bold uppercase tracking-wider text-indigo-600">{book.category || "Book"}</p><h1 className="mt-3 text-4xl font-black text-slate-900">{book.title}</h1><p className="mt-2 text-lg text-slate-600">by {book.author}</p><div className="mt-5 flex items-center gap-4"><span className="text-3xl font-black">₹{Number(book.price || 0).toLocaleString("en-IN")}</span><span className="flex items-center gap-1 font-semibold text-amber-500"><FaStar /> {averageRating ? averageRating.toFixed(1) : "—"} <span className="font-normal text-slate-500">({reviewCount} {reviewCount === 1 ? "review" : "reviews"})</span></span></div><p className={`mt-5 inline-block rounded-full px-3 py-1 text-sm font-bold ${available ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{available ? `${book.stock} in stock` : "Out of stock"}</p><p className="mt-6 leading-8 text-slate-600">{book.description || "A thoughtful addition to your reading list."}</p><div className="mt-7 flex flex-wrap items-center gap-3"><div className="flex items-center rounded-xl border border-slate-300"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3" aria-label="Decrease quantity"><FaMinus /></button><span className="w-10 text-center font-bold">{quantity}</span><button type="button" onClick={() => setQuantity(Math.min(Number(book.stock) || 1, quantity + 1))} className="p-3" aria-label="Increase quantity"><FaPlus /></button></div><button type="button" disabled={!available} onClick={() => { for (let index = 0; index < quantity; index += 1) addToCart(book); }} className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-indigo-600 disabled:opacity-50"><FaShoppingCart /> Add to Cart</button><button type="button" onClick={() => toggleWishlist(book)} aria-label="Toggle wishlist" className={`rounded-xl border p-3 ${inWishlist ? "border-rose-200 bg-rose-50 text-rose-600" : "border-slate-300"}`}><FaHeart /></button><button type="button" aria-label="Share book" onClick={() => navigator.clipboard?.writeText(window.location.href)} className="rounded-xl border border-slate-300 p-3"><FaShareAlt /></button></div></div></section>{relatedBooks.length > 0 && <section className="mt-16"><h2 className="text-3xl font-black">Related books</h2><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{relatedBooks.map((item) => <BookCard key={item._id} book={item} />)}</div></section>}<section className="mt-16 rounded-2xl bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-black">Reader reviews</h2><p className="mt-1 text-sm text-slate-500">{reviewCount ? `${averageRating.toFixed(1)} average from ${reviewCount} ${reviewCount === 1 ? "reader" : "readers"}` : "No reviews yet."}</p></div>{averageRating > 0 && <RatingStars rating={Math.round(averageRating)} />}</div>{user ? <form onSubmit={submitReview} className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><label className="font-semibold text-slate-800">{ownReview ? "Update your review" : "Leave a review"}</label><RatingStars rating={Number(reviewForm.rating)} interactive onChange={(rating) => setReviewForm((current) => ({ ...current, rating }))} /></div><label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="review-comment">Your review</label><textarea id="review-comment" value={reviewForm.comment} onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))} maxLength="1000" required rows="4" placeholder="Share what you thought about this book" className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-indigo-500" /><div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-slate-500">{reviewForm.comment.length}/1000</span><div className="flex gap-2">{ownReview && <button type="button" onClick={removeReview} className="rounded-xl border border-rose-200 px-4 py-2 font-semibold text-rose-600 hover:bg-rose-50">Delete</button>}<button type="submit" disabled={reviewSubmitting} className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-indigo-600 disabled:opacity-60">{reviewSubmitting ? "Saving…" : ownReview ? "Update review" : "Post review"}</button></div></div></form> : <p className="mt-6 rounded-xl bg-indigo-50 p-4 text-slate-700"><Link to="/login" className="font-bold text-indigo-600">Log in</Link> to leave a review.</p>}<div className="mt-8 space-y-5">{reviewsLoading ? <div className="h-28 animate-pulse rounded-xl bg-slate-100" /> : reviews.length ? reviews.map((review) => <article key={review._id} className="border-t border-slate-100 pt-5 first:border-t-0 first:pt-0"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold text-slate-900">{review.user?.name || "Reader"}</p><p className="mt-1 text-sm text-slate-500">{new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p></div><RatingStars rating={review.rating} /></div><p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">{review.comment}</p></article>) : <p className="py-8 text-center text-slate-500">Be the first to review this book.</p>}</div></section></div>;
}

export default BookDetailsPage;
