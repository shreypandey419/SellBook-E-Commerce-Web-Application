import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

function NotFoundPage() {
  return <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4 text-center"><Motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}><p className="text-7xl">📖</p><p className="mt-5 text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">404</p><h1 className="mt-2 text-4xl font-black text-slate-900">This page is off the shelf.</h1><p className="mt-4 text-slate-600">The link may be outdated, or the page may have moved.</p><Link to="/" className="mt-7 inline-block rounded-xl bg-slate-900 px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-indigo-600">Return home</Link></Motion.div></div>;
}

export default NotFoundPage;
