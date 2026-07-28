import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "react-toastify";

const WishlistContext = createContext(null);
const storageKey = "sellbook-wishlist";
const readWishlist = () => { try { return JSON.parse(localStorage.getItem(storageKey)) || []; } catch { return []; } };

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(readWishlist);
  const [ready, setReady] = useState(false);
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(items)); setReady(true); }, [items]);

  const isInWishlist = useCallback((id) => items.some((item) => item.id === id), [items]);

  const toggleWishlist = useCallback((book) => {
    const exists = isInWishlist(book._id || book.id);
    const item = { id: book._id || book.id, title: book.title, author: book.author, price: book.price, image: book.image, category: book.category };
    setItems((currentItems) => exists ? currentItems.filter((currentItem) => currentItem.id !== item.id) : [...currentItems, item]);
    toast[exists ? "info" : "success"](exists ? "Removed from wishlist." : "Added to wishlist.");
  }, [isInWishlist]);

  const removeFromWishlist = useCallback((id) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    toast.info("Removed from wishlist.");
  }, []);

  const value = useMemo(() => ({ items, ready, wishlistItems: items, count: items.length, wishlistCount: items.length, isInWishlist, isItemInWishlist: isInWishlist, toggleWishlist, removeFromWishlist }), [items, ready, isInWishlist, toggleWishlist, removeFromWishlist]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
