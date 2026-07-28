import { motion as Motion } from "framer-motion";

function ChartCard({ title, data, formatValue = (value) => value }) {
  const maximumValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <Motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-lg shadow-slate-200/50 backdrop-blur"
    >
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <div className="mt-6 flex h-48 items-end gap-3">
        {data.map((item) => (
          <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
            <span className="text-xs text-slate-500">{formatValue(item.value)}</span>
            <div className="flex h-36 w-full items-end rounded-t-lg bg-slate-100">
              <Motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max((item.value / maximumValue) * 100, item.value ? 4 : 0)}%` }}
                transition={{ duration: 0.5 }}
                className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-400"
                aria-label={`${item.label}: ${formatValue(item.value)}`}
              />
            </div>
            <span className="text-xs font-medium text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
    </Motion.section>
  );
}

export default ChartCard;
