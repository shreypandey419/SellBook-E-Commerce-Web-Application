import { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useLocation } from "react-router-dom";

function RouteLoader() {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  useEffect(() => { setLoading(true); const timeout = window.setTimeout(() => setLoading(false), 260); return () => window.clearTimeout(timeout); }, [pathname]);
  return <AnimatePresence>{loading && <Motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 0.85 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-x-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-indigo-600 via-violet-500 to-sky-400" />}</AnimatePresence>;
}

export default RouteLoader;
