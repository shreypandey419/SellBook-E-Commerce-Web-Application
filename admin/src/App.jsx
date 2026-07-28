import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import apiClient from "./api/client";

import Sidebar from "./components/Sidebar";
import AddBook from "./components/AddBook";
import BookList from "./components/BookList";
import Orders from "./components/Orders";
import Login from "./components/Login";
import Dashboard from "./components/dashboard/Dashboard";
import Coupons from "./components/Coupons";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const clearSession = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      if (isMounted) setIsLoggedIn(false);
    };

    const validateSession = async () => {
      if (!localStorage.getItem("token")) {
        clearSession();
        return;
      }

      try {
        const { data } = await apiClient.get("/api/admin/me");
        localStorage.setItem("admin", JSON.stringify(data.admin));
        if (isMounted) setIsLoggedIn(true);
      } catch {
        clearSession();
      }
    };

    window.addEventListener("admin-auth-expired", clearSession);
    validateSession();

    return () => {
      isMounted = false;
      window.removeEventListener("admin-auth-expired", clearSession);
    };
  }, []);

  if (isLoggedIn === null) {
    return <div className="min-h-screen bg-slate-100" />;
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/list-books" element={<BookList />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
