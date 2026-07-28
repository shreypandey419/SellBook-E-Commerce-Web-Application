import express from "express";
import { createReview, deleteReview, updateReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/", createReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
