import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <Motion.div key={location.pathname} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
            <Outlet />
          </Motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
