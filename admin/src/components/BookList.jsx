import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaChevronLeft, FaChevronRight, FaEdit, FaEye, FaSearch, FaTimes, FaTrash } from "react-icons/fa";
import apiClient from "../api/client";
const pageSize = 8;

function Modal({ children, title, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <FaTimes />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [minimumRating, setMinimumRating] = useState("");
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [sortConfig, setSortConfig] = useState("newest");
  const [page, setPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);

    try {
      const { data } = await apiClient.get("/api/books");
      if (data.success) setBooks(data.books);
      else toast.error("Failed to load books.");
    } catch {
      toast.error("Could not connect to the book service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(books.map((book) => book.category).filter(Boolean))],
    [books]
  );

  const displayedBooks = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    let filtered = books.filter((book) => {
      const searchableText = `${book.title} ${book.author} ${book.category}`.toLowerCase();
      const hasMatchingSearch = !searchTerm || searchableText.includes(searchTerm);
      const hasMatchingCategory = filterCategory === "All" || book.category === filterCategory;
      const hasMatchingRating = !minimumRating || Number(book.rating) >= Number(minimumRating);
      const hasMatchingMinimumPrice = !minimumPrice || Number(book.price) >= Number(minimumPrice);
      const hasMatchingMaximumPrice = !maximumPrice || Number(book.price) <= Number(maximumPrice);

      return hasMatchingSearch && hasMatchingCategory && hasMatchingRating && hasMatchingMinimumPrice && hasMatchingMaximumPrice;
    });

    if (sortConfig === "priceLowToHigh") filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sortConfig === "priceHighToLow") filtered = [...filtered].sort((a, b) => b.price - a.price);
    if (sortConfig === "topRated") filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    if (sortConfig === "title") filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));

    return filtered;
  }, [books, filterCategory, maximumPrice, minimumPrice, minimumRating, search, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(displayedBooks.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedBooks = displayedBooks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetToFirstPage = (update) => {
    update();
    setPage(1);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditingBook((book) => ({ ...book, [name]: value }));
  };

  const saveBook = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...editingBook,
        price: Number(editingBook.price),
        stock: Number(editingBook.stock ?? editingBook.stockQuantity),
        rating: Number(editingBook.rating),
      };
      const { data } = await apiClient.put(`/api/books/${editingBook._id}`, payload);

      if (data.success) {
        setBooks((currentBooks) => currentBooks.map((book) => (book._id === data.book._id ? data.book : book)));
        setEditingBook(null);
        toast.success("Book updated successfully.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update book.");
    } finally {
      setSaving(false);
    }
  };

  const deleteBook = async () => {
    if (!bookToDelete) return;

    try {
      const { data } = await apiClient.delete(`/api/books/${bookToDelete._id}`);
      if (data.success) {
        setBooks((currentBooks) => currentBooks.filter((book) => book._id !== bookToDelete._id));
        toast.success("Book deleted.");
      }
    } catch {
      toast.error("Failed to delete book.");
    } finally {
      setBookToDelete(null);
    }
  };

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Book List</h1>
        <p className="mt-1 text-slate-600">Search, update, and manage your catalogue.</p>
      </div>

      <div className="mb-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-6">
        <label className="relative xl:col-span-2">
          <span className="sr-only">Search books</span>
          <FaSearch className="absolute left-3 top-3.5 text-slate-400" />
          <input value={search} onChange={(event) => resetToFirstPage(() => setSearch(event.target.value))} placeholder="Search title, author, category" className="w-full rounded-lg border py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </label>
        <select value={filterCategory} onChange={(event) => resetToFirstPage(() => setFilterCategory(event.target.value))} className="rounded-lg border p-2.5">
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <select value={minimumRating} onChange={(event) => resetToFirstPage(() => setMinimumRating(event.target.value))} className="rounded-lg border p-2.5">
          <option value="">Any rating</option>
          <option value="4">4★ & up</option>
          <option value="3">3★ & up</option>
          <option value="2">2★ & up</option>
        </select>
        <input type="number" min="0" value={minimumPrice} onChange={(event) => resetToFirstPage(() => setMinimumPrice(event.target.value))} placeholder="Min price" className="rounded-lg border p-2.5" />
        <input type="number" min="0" value={maximumPrice} onChange={(event) => resetToFirstPage(() => setMaximumPrice(event.target.value))} placeholder="Max price" className="rounded-lg border p-2.5" />
        <select value={sortConfig} onChange={(event) => resetToFirstPage(() => setSortConfig(event.target.value))} className="rounded-lg border p-2.5 xl:col-start-6">
          <option value="newest">Newest</option>
          <option value="title">Title A–Z</option>
          <option value="priceLowToHigh">Price: low to high</option>
          <option value="priceHighToLow">Price: high to low</option>
          <option value="topRated">Top rated</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-5">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-16 animate-pulse rounded-lg bg-slate-100" />)}</div>
        ) : paginatedBooks.length === 0 ? (
          <div className="p-14 text-center"><h2 className="text-xl font-semibold">No books found</h2><p className="mt-2 text-slate-500">Try changing the search or filters.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-4">Book</th><th className="p-4">Author</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Rating</th><th className="p-4">Stock</th><th className="p-4">Actions</th></tr></thead>
              <tbody>
                {paginatedBooks.map((book) => (
                  <tr key={book._id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="p-4"><div className="flex items-center gap-3">{book.image ? <img src={book.image} alt="" className="h-12 w-9 rounded object-cover" /> : <div className="h-12 w-9 rounded bg-slate-200" />}<span className="font-medium text-slate-900">{book.title}</span></div></td>
                    <td className="p-4 text-slate-600">{book.author}</td><td className="p-4 text-slate-600">{book.category}</td><td className="p-4 font-medium">₹{book.price}</td><td className="p-4">{book.rating || "—"}</td><td className="p-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${Number(book.stock ?? book.stockQuantity ?? 0) <= 0 ? "bg-rose-100 text-rose-700" : Number(book.stock ?? book.stockQuantity ?? 0) <= 5 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>{Number(book.stock ?? book.stockQuantity ?? 0) <= 0 ? "Out of stock" : Number(book.stock ?? book.stockQuantity ?? 0) <= 5 ? `Low: ${book.stock ?? book.stockQuantity}` : `In stock: ${book.stock ?? book.stockQuantity}`}</span></td>
                    <td className="p-4"><div className="flex gap-2"><button type="button" onClick={() => setSelectedBook(book)} aria-label={`View ${book.title}`} className="rounded p-2 text-blue-600 hover:bg-blue-50"><FaEye /></button><button type="button" onClick={() => setEditingBook({ ...book })} aria-label={`Edit ${book.title}`} className="rounded p-2 text-amber-600 hover:bg-amber-50"><FaEdit /></button><button type="button" onClick={() => setBookToDelete(book)} aria-label={`Delete ${book.title}`} className="rounded p-2 text-red-600 hover:bg-red-50"><FaTrash /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && displayedBooks.length > 0 && <div className="flex items-center justify-between border-t p-4 text-sm text-slate-600"><span>Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, displayedBooks.length)} of {displayedBooks.length}</span><div className="flex items-center gap-2"><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="rounded border p-2 disabled:cursor-not-allowed disabled:opacity-40"><FaChevronLeft /></button><span>Page {currentPage} of {totalPages}</span><button type="button" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} className="rounded border p-2 disabled:cursor-not-allowed disabled:opacity-40"><FaChevronRight /></button></div></div>}
      </div>

      {selectedBook && <Modal title={selectedBook.title} onClose={() => setSelectedBook(null)}><div className="grid gap-6 sm:grid-cols-[160px_1fr]">{selectedBook.image && <img src={selectedBook.image} alt={`${selectedBook.title} cover`} className="w-full rounded-xl object-cover" />}<div className="space-y-2 text-slate-700"><p><strong>Author:</strong> {selectedBook.author}</p><p><strong>Category:</strong> {selectedBook.category}</p><p><strong>Price:</strong> ₹{selectedBook.price}</p><p><strong>Rating:</strong> {selectedBook.rating || "—"}</p><p><strong>Stock:</strong> {selectedBook.stock}</p><p className="pt-2"><strong>Description:</strong><br />{selectedBook.description || "No description provided."}</p></div></div></Modal>}

      {editingBook && <Modal title="Edit Book" onClose={() => setEditingBook(null)}><form onSubmit={saveBook} className="grid gap-4 sm:grid-cols-2">{[["title", "Title"], ["author", "Author"], ["category", "Category"], ["price", "Price"], ["stock", "Stock"], ["rating", "Rating"]].map(([name, label]) => <label key={name} className="text-sm font-medium text-slate-700">{label}<input name={name} required={name !== "rating"} type={["price", "stock", "rating"].includes(name) ? "number" : "text"} step={name === "rating" ? "0.1" : undefined} min={["price", "stock", "rating"].includes(name) ? "0" : undefined} value={editingBook[name] ?? ""} onChange={handleEditChange} className="mt-1 w-full rounded-lg border p-2.5 font-normal" /></label>)}<label className="sm:col-span-2 text-sm font-medium text-slate-700">Description<textarea name="description" rows="4" value={editingBook.description ?? ""} onChange={handleEditChange} className="mt-1 w-full rounded-lg border p-2.5 font-normal" /></label><div className="sm:col-span-2 flex justify-end gap-3"><button type="button" onClick={() => setEditingBook(null)} className="rounded-lg border px-4 py-2">Cancel</button><button disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50">{saving ? "Saving..." : "Save changes"}</button></div></form></Modal>}

      {bookToDelete && <Modal title="Delete Book" onClose={() => setBookToDelete(null)}><p className="text-slate-600">Are you sure you want to delete <strong>{bookToDelete.title}</strong>? This cannot be undone.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setBookToDelete(null)} className="rounded-lg border px-4 py-2">Cancel</button><button type="button" onClick={deleteBook} className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700">Delete book</button></div></Modal>}
    </section>
  );
}

export default BookList;
