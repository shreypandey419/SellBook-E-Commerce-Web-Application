import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getJwtSecret = () => process.env.JWT_SECRET;

const createToken = (admin) =>
  jwt.sign(
    { sub: admin._id.toString(), role: admin.role },
    getJwtSecret(),
    { expiresIn: "7d" }
  );

const serializeAdmin = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
});

export const loginAdmin = async (req, res) => {
  const email = req.body?.email?.trim().toLowerCase();
  const password = req.body?.password;

  if (!email || !password || !emailPattern.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email and password.",
    });
  }

  if (!getJwtSecret()) {
    return res.status(500).json({
      success: false,
      message: "Authentication is not configured.",
    });
  }

  try {
    const admin = await Admin.findOne({ email }).select("+password");
    const isPasswordValid = admin && await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return res.status(200).json({
      success: true,
      token: createToken(admin),
      admin: serializeAdmin(admin),
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to sign in. Please try again.",
    });
  }
};

export const getCurrentAdmin = (req, res) =>
  res.status(200).json({
    success: true,
    admin: serializeAdmin(req.admin),
  });
