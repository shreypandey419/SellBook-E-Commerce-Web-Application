import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import apiClient from "../api/client";
import BookCard from "./BookCard";

function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const search = searchParams.get("search") || "";

  useEffect(() => { apiClient.get("/api/books").then(({ data }) => setBooks(data.books || data.data?.books || [])).catch(() => setError("We couldn’t load books right now.")).finally(() => setLoading(false)); }, []);
  const categories = useMemo(() => [...new Set(books.map((book) => book.category).filter(Boolean))], [books]);
  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    let results = books.filter((book) => (!query || `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query)) && (!category || book.category === category) && (!maximumPrice || Number(book.price) <= Number(maximumPrice)));
    if (sort === "price-low") results = [...results].sort((first, second) => first.price - second.price);
    if (sort === "price-high") results = [...results].sort((first, second) => second.price - first.price);
    if (sort === "rating") results = [...results].sort((first, second) => second.rating - first.rating);
    return results;
  }, [books, category, maximumPrice, search, sort]);
  const latestBooks = books.slice(0, 4);
  const popularBooks = useMemo(() => [...books].sort((first, second) => Number(second.rating) - Number(first.rating)).slice(0, 4), [books]);
  const section = (title, subtitle, items, id) => <section id={id} className="mt-16"><div className="mb-6"><p className="text-sm font-bold uppercase tracking-wider text-indigo-600">Discover more</p><h2 className="text-3xl font-black text-slate-900">{title}</h2><p className="mt-1 text-slate-600">{subtitle}</p></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{items.map((book) => <BookCard key={book._id} book={book} />)}</div></section>;

  return <div className="mx-auto max-w-7xl"><section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-6 py-14 text-white sm:px-10"><Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">A book for every chapter</p><h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight sm:text-6xl">Discover stories that stay with you.</h1><p className="mt-5 max-w-xl text-lg text-slate-300">Browse a growing collection of thoughtful reads, fresh arrivals, and reader favourites.</p></Motion.div></section><section className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="grid gap-3 md:grid-cols-4"><input value={search} onChange={(event) => setSearchParams(event.target.value ? { search: event.target.value } : {})} placeholder="Search books or authors" className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500" /><select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5"><option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><input type="number" min="0" value={maximumPrice} onChange={(event) => setMaximumPrice(event.target.value)} placeholder="Maximum price" className="rounded-xl border border-slate-200 px-3 py-2.5" /><select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5"><option value="newest">Newest first</option><option value="rating">Highest rated</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div></section><section className="mt-12"><div className="mb-6 flex items-end justify-between"><div><p className="text-sm font-bold uppercase tracking-wider text-indigo-600">The catalogue</p><h2 className="text-3xl font-black text-slate-900">Featured Books</h2></div><span className="text-sm text-slate-500">{filteredBooks.length} books</span></div>{loading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-96 animate-pulse rounded-2xl bg-slate-200" />)}</div> : error ? <div className="rounded-2xl bg-rose-50 p-8 text-center text-rose-700">{error}</div> : filteredBooks.length === 0 ? <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center"><h3 className="text-xl font-bold">No books found</h3><p className="mt-2 text-slate-500">Try changing your search or filters.</p></Motion.div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{filteredBooks.map((book) => <BookCard key={book._id} book={book} />)}</div>}</section>{!loading && !error && latestBooks.length > 0 && section("Latest Books", "Freshly added to the SellBook shelves.", latestBooks, "latest")}{!loading && !error && popularBooks.length > 0 && section("Popular Books", "The highest-rated reads in our collection.", popularBooks, "popular")}</div>;
}

export default HomePage;
