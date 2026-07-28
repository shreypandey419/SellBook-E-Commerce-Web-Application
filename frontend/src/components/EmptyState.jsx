import { motion as Motion } from "framer-motion";

function EmptyState({ icon = "📚", title, message, action }) {
  return <Motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm"><span className="text-5xl" role="img" aria-label="Empty state">{icon}</span><h1 className="mt-4 text-2xl font-black text-slate-900">{title}</h1><p className="mx-auto mt-2 max-w-md text-slate-600">{message}</p>{action && <div className="mt-6">{action}</div>}</Motion.div>;
}

export default EmptyState;
