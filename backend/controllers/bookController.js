import Book from "../models/bookModel.js";

const withImageUrl = (book, req) => {
  const value = book.toObject ? book.toObject() : book;
  if (value.image?.startsWith("/")) value.image = `${req.protocol}://${req.get("host")}${value.image}`;
  return value;
};

export const uploadBookImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload a book image.",
    });
  }

  return res.status(201).json({
    success: true,
    message: "Image uploaded successfully.",
    image: `/uploads/books/${req.file.filename}`,
  });
};

// Get all books
export const getBooks = async (req, res) => {
  try {
    const books = (await Book.find().sort({ createdAt: -1 })).map((book) => withImageUrl(book, req));

    return res.status(200).json({
      success: true,
      message: "Books loaded successfully.",
      books,
      data: { books },
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to load books.",
    });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found." });
    const formattedBook = withImageUrl(book, req);
    return res.status(200).json({ success: true, message: "Book loaded successfully.", book: formattedBook, data: { book: formattedBook } });
  } catch (_error) {
    return res.status(400).json({ success: false, message: "Invalid book identifier." });
  }
};

// Add new book
export const addBook = async (req, res) => {
  try {
    const quantity = Number(req.body.stock ?? req.body.stockQuantity ?? 0);
    const book = await Book.create({ ...req.body, stock: quantity });

    res.status(201).json({
      success: true,
      message: "Book Added Successfully",
      book,
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to add the book.",
    });
  }
};

// Update an existing book
export const updateBook = async (req, res) => {
  try {
    const { _id, __v, createdAt, updatedAt, ...bookUpdates } = req.body;
    if (bookUpdates.stock !== undefined || bookUpdates.stockQuantity !== undefined) {
      const quantity = Number(bookUpdates.stock ?? bookUpdates.stockQuantity);
      bookUpdates.stock = quantity;
      delete bookUpdates.stockQuantity;
    }
    const book = await Book.findByIdAndUpdate(req.params.id, bookUpdates, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.json({
      success: true,
      message: "Book updated successfully",
      book,
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update the book.",
    });
  }
};

// Delete book
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully.",
      data: {},
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete the book.",
    });
  }
};
