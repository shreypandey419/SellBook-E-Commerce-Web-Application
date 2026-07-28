import express from "express";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import helmet from "helmet";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 4000;
const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadsDirectory = path.join(backendDirectory, "uploads");

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : [];

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS."));
  },
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(uploadsDirectory));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running"
  });
});

app.use("/api/orders", orderRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);

app.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image must be 5 MB or smaller."
        : "Please upload a valid image file.";

    return res.status(400).json({ success: false, message });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

app.listen(PORT);
