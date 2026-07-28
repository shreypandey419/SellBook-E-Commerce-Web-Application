import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";

const unauthorized = (res, message) =>
  res.status(401).json({ success: false, message });

export const protectAdmin = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return unauthorized(res, "Authentication is required.");
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Authentication is not configured.",
    });
  }

  try {
    const token = authorization.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.sub).select("_id name email role");

    if (!admin || payload.role !== "admin" || admin.role !== "admin") {
      return unauthorized(res, "Your session is no longer valid.");
    }

    req.admin = admin;
    return next();
  } catch (_error) {
    return unauthorized(res, "Your session has expired or is invalid.");
  }
};

export const protect = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ") || !process.env.JWT_SECRET) {
    return unauthorized(res, "Authentication is required.");
  }

  try {
    const decoded = jwt.verify(authorization.slice(7), process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return unauthorized(res, "Your session is no longer valid.");

    req.user = user;
    return next();
  } catch (_error) {
    return unauthorized(res, "Your session has expired or is invalid.");
  }
};
