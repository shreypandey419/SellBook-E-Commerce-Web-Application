import { Link } from "react-router-dom";
import { useCart } from "../CartContext/CartContext";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import EmptyState from "./EmptyState";
import PageSkeleton from "./PageSkeleton";

const CartPage = () => {
  const { cartItems, ready } = useCart();

  if (!ready) return <PageSkeleton cards={3} />;

  if (cartItems.length === 0) {
    return (
      <EmptyState icon="🛒" title="Your cart is empty" message="Looks like you haven’t added anything to your cart yet." action={<Link to="/" className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-indigo-600">Continue shopping</Link>} />
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 text-3xl font-black">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">{cartItems.map((item) => <CartItem key={item.id} item={item} />)}</div>
        <CartSummary />
      </div>
    </div>
  );
};

export default CartPage;
