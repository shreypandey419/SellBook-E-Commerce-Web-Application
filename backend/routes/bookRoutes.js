import express from "express";

import {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  uploadBookImage,
} from "../controllers/bookController.js";
import { getBookReviews } from "../controllers/reviewController.js";
import uploadBookImageMiddleware from "../middleware/uploadMiddleware.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id/reviews", getBookReviews);
router.get("/:id", getBookById);

router.use(protectAdmin);

router.post("/upload", uploadBookImageMiddleware.single("image"), uploadBookImage);

router.post("/", addBook);

router.put("/:id", updateBook);

router.delete("/:id", deleteBook);

export default router;
