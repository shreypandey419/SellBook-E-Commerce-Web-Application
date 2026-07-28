import mongoose from "mongoose";
import Book from "../models/bookModel.js";
import Review from "../models/reviewModel.js";

const reviewUserFields = "name photoURL avatar";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const normalizeReviewInput = (body) => {
  const rating = Number(body.rating);
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Please select a rating from 1 to 5." };
  }

  if (!comment) return { error: "Please write a review comment." };
  if (comment.length > 1000) return { error: "Review comments must be 1000 characters or fewer." };

  return { rating, comment };
};

const updateBookRating = async (bookId) => {
  const objectId = new mongoose.Types.ObjectId(bookId);
  const [stats] = await Review.aggregate([
    { $match: { book: objectId } },
    {
      $group: {
        _id: "$book",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  await Book.findByIdAndUpdate(bookId, {
    rating: stats ? Math.round(stats.averageRating * 10) / 10 : 0,
    reviewCount: stats?.reviewCount || 0,
  });
};

const isReviewOwner = (review, user) => String(review.user) === String(user._id);

export const getBookReviews = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid book identifier." });
  }

  try {
    const reviews = await Review.find({ book: req.params.id })
      .populate("user", reviewUserFields)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Reviews loaded successfully.",
      reviews,
      data: { reviews },
    });
  } catch (_error) {
    return res.status(500).json({ success: false, message: "Unable to load reviews." });
  }
};

export const createReview = async (req, res) => {
  const { bookId } = req.body;
  const input = normalizeReviewInput(req.body);

  if (!isValidObjectId(bookId)) {
    return res.status(400).json({ success: false, message: "Please provide a valid book." });
  }
  if (input.error) return res.status(400).json({ success: false, message: input.error });

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ success: false, message: "Book not found." });

    const existingReview = await Review.exists({ user: req.user._id, book: bookId });
    if (existingReview) {
      return res.status(409).json({ success: false, message: "You have already reviewed this book." });
    }

    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      rating: input.rating,
      comment: input.comment,
    });
    await updateBookRating(bookId);
    await review.populate("user", reviewUserFields);

    return res.status(201).json({
      success: true,
      message: "Review added successfully.",
      review,
      data: { review },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: "You have already reviewed this book." });
    }
    return res.status(500).json({ success: false, message: "Unable to add your review." });
  }
};

export const updateReview = async (req, res) => {
  const input = normalizeReviewInput(req.body);
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid review identifier." });
  }
  if (input.error) return res.status(400).json({ success: false, message: input.error });

  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });
    if (!isReviewOwner(review, req.user)) {
      return res.status(403).json({ success: false, message: "You can only edit your own review." });
    }

    review.rating = input.rating;
    review.comment = input.comment;
    await review.save();
    await updateBookRating(review.book);
    await review.populate("user", reviewUserFields);

    return res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      review,
      data: { review },
    });
  } catch (_error) {
    return res.status(500).json({ success: false, message: "Unable to update your review." });
  }
};

export const deleteReview = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid review identifier." });
  }

  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });
    if (!isReviewOwner(review, req.user)) {
      return res.status(403).json({ success: false, message: "You can only delete your own review." });
    }

    const { book } = review;
    await review.deleteOne();
    await updateBookRating(book);

    return res.status(200).json({ success: true, message: "Review deleted successfully.", data: {} });
  } catch (_error) {
    return res.status(500).json({ success: false, message: "Unable to delete your review." });
  }
};
