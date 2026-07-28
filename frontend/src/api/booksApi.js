import axios from "axios";

const booksApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

export const getBooks = async () => {
  const { data } = await booksApi.get("/api/books");
  return data.books || [];
};