import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext(null);
const storageKey = "sellbook-cart";

const readCart = () => {
  try { return JSON.parse(localStorage.getItem(storageKey)) || []; } catch { return []; }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);
  const [ready, setReady] = useState(false);

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(items)); setReady(true); }, [items]);

  const addToCart = (product) => {
    setItems((currentItems) => {
      const normalizedProduct = { ...product, id: product._id || product.id };
      const existing = currentItems.find((item) => item.id === normalizedProduct.id);
      if (existing) return currentItems.map((item) => item.id === normalizedProduct.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...currentItems, { ...normalizedProduct, quantity: 1 }];
    });
    toast.success(`${product.title} added to cart.`);
  };

  const updateQuantity = (id, quantity) => setItems((currentItems) => currentItems.map((item) => item.id === id ? { ...item, quantity } : item).filter((item) => item.quantity > 0));
  const removeFromCart = (id) => { setItems((currentItems) => currentItems.filter((item) => item.id !== id)); toast.info("Item removed from cart."); };
  const clearCart = () => { setItems([]); toast.info("Cart cleared."); };

  const value = useMemo(() => ({
    items,
    ready,
    cart: { items },
    cartItems: items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    cartCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + Number(item.price || 0) * item.quantity, 0),
    cartSubtotal: items.reduce((total, item) => total + Number(item.price || 0) * item.quantity, 0),
  }), [items, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
