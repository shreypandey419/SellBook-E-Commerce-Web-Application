function PageSkeleton({ cards = 4 }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: cards }, (_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-200" />)}</div>;
}

export default PageSkeleton;
