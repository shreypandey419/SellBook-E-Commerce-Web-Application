import axios from "axios";

const booksApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://sellbook.onrender.com",
});

export const getBooks = async () => {
  const { data } = await booksApi.get("/api/books");
  return data.books || [];
};