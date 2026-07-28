import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import BookDetailsPage from "./components/BookDetailsPage";
import CartPage from "./components/CartPage";
import WishlistPage from "./components/WishlistPage";
import CheckoutPage from "./components/CheckoutPage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/Auth/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./components/NotFoundPage";
import RouteLoader from "./components/RouteLoader";
import ScrollToTop from "./components/ScrollToTop";
import MyOrdersPage from "./components/MyOrdersPage";
import OrderSuccessPage from "./components/OrderSuccessPage";

function App() {
  return (
    <>
      <ScrollToTop />
      <RouteLoader />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="book/:id" element={<BookDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
          <Route path="order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer position="bottom-right" autoClose={2800} hideProgressBar theme="colored" toastClassName="rounded-xl shadow-xl" />
    </>
  );
}

export default App;
