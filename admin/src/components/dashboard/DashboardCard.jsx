import { createElement } from "react";
import { motion as Motion } from "framer-motion";

const accentStyles = {
  blue: "bg-blue-100 text-blue-600",
  indigo: "bg-indigo-100 text-indigo-600",
  emerald: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-600",
  green: "bg-green-100 text-green-600",
  red: "bg-rose-100 text-rose-600",
};

function DashboardCard({ icon, label, value, accent = "blue" }) {
  return (
    <Motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-lg shadow-slate-200/50 backdrop-blur"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`rounded-xl p-3 ${accentStyles[accent] || accentStyles.blue}`}>
          {createElement(icon, { size: 20 })}
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
    </Motion.article>
  );
}

export default DashboardCard;
