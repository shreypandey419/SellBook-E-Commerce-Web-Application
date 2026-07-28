import { createElement, useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaBook, FaChartPie, FaList, FaShoppingCart, FaSignOutAlt, FaTags } from "react-icons/fa";

const navItems = [
  { path: "/dashboard", icon: FaChartPie, label: "Dashboard" },
  { path: "/add-book", icon: FaBook, label: "Add Books" },
  { path: "/list-books", icon: FaList, label: "List Books" },
  { path: "/orders", icon: FaShoppingCart, label: "Orders" },
  { path: "/coupons", icon: FaTags, label: "Coupons" },
];

function Sidebar({ onLogout }) {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const confirmLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    toast.success("Logged out successfully.");
    onLogout();
  };

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-slate-900 p-5 text-white">
      <h1 className="mb-8 text-2xl font-bold">SellBook Admin</h1>
      <nav className="space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                isActive ? "bg-blue-600" : "hover:bg-slate-800"
              }`
            }
          >
            {createElement(Icon, { size: 20 })}
            {label}
          </NavLink>
        ))}
      </nav>

      <Motion.button
        type="button"
        onClick={() => setShowLogoutConfirmation(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-auto flex items-center gap-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-left text-red-100 transition hover:bg-red-500/20"
      >
        <FaSignOutAlt size={20} />
        Logout
      </Motion.button>

      <AnimatePresence>
        {showLogoutConfirmation && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
          >
            <Motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 text-slate-900 shadow-2xl"
            >
              <h2 id="logout-dialog-title" className="text-xl font-bold">Logout</h2>
              <p className="mt-2 text-slate-600">Are you sure you want to logout?</p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirmation(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <Motion.button
                  type="button"
                  onClick={confirmLogout}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
                >
                  Logout
                </Motion.button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}

export default Sidebar;
