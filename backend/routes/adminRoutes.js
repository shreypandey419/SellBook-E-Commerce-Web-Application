import express from "express";
import { getCurrentAdmin, loginAdmin } from "../controllers/adminController.js";
import { getDashboard } from "../controllers/dashboardController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getCurrentAdmin);
router.get("/dashboard", protectAdmin, getDashboard);

export default router;
