import { Link } from "react-router-dom";
import { useWishlist } from "../WishlistContext/WishlistContext";
import WishlistItem from "../components/WishlistItem";
import EmptyState from "./EmptyState";
import PageSkeleton from "./PageSkeleton";

const WishlistPage = () => {
  const { wishlistItems, ready } = useWishlist();

  if (!ready) return <PageSkeleton />;

  if (wishlistItems.length === 0) {
    return (
      <EmptyState icon="💜" title="Your wishlist is waiting" message="Save books you love and return to them whenever you’re ready." action={<Link to="/" className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-indigo-600">Discover books</Link>} />
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-6 text-3xl font-black">My Wishlist</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{wishlistItems.map((item) => <WishlistItem key={item.id} item={item} />)}</div>
    </div>
  );
};

export default WishlistPage;
