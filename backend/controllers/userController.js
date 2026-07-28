import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { verifyFirebaseToken } from "../services/firebaseService.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const serializeUser = (user) => ({ id: user._id, name: user.name, email: user.email, phone: user.phone || "", avatar: user.avatar || "" });
const createToken = (user) => jwt.sign({ id: user._id.toString(), role: "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });
const sendAuth = (res, status, message, user) => {
  const token = createToken(user);
  const data = { user: serializeUser(user), token };
  return res.status(status).json({ success: true, message, data, ...data });
};

export const registerUser = async (req, res) => {
  const name = req.body?.name?.trim();
  const email = req.body?.email?.trim().toLowerCase();
  const password = req.body?.password;

  if (!process.env.JWT_SECRET) return res.status(500).json({ success: false, message: "Authentication is not configured." });
  if (!name || !emailPattern.test(email || "") || !password || password.length < 8) return res.status(400).json({ success: false, message: "Name, valid email, and an 8-character password are required." });

  try {
    if (await User.exists({ email })) return res.status(409).json({ success: false, message: "An account with this email already exists." });
    const user = await User.create({ name, email, password, phone: req.body?.phone, avatar: req.body?.avatar });
    return sendAuth(res, 201, "Account created successfully.", user);
  } catch (_error) {
    return res.status(500).json({ success: false, message: "Unable to create the account." });
  }
};

export const loginUser = async (req, res) => {
  const email = req.body?.email?.trim().toLowerCase();
  const password = req.body?.password;

  if (!process.env.JWT_SECRET) return res.status(500).json({ success: false, message: "Authentication is not configured." });
  if (!emailPattern.test(email || "") || !password) return res.status(400).json({ success: false, message: "Please provide a valid email and password." });

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ success: false, message: "Invalid email or password." });
    return sendAuth(res, 200, "Signed in successfully.", user);
  } catch (_error) {
    return res.status(500).json({ success: false, message: "Unable to sign in." });
  }
};

export const getUserProfile = (req, res) => res.status(200).json({ success: true, message: "Profile loaded.", data: { user: serializeUser(req.user) }, user: serializeUser(req.user) });

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (req.body?.email && !emailPattern.test(req.body.email.trim())) return res.status(400).json({ success: false, message: "Please provide a valid email." });
    user.name = req.body?.name?.trim() || user.name;
    user.email = req.body?.email?.trim().toLowerCase() || user.email;
    user.phone = req.body?.phone?.trim() || user.phone;
    user.avatar = req.body?.avatar || user.avatar;
    await user.save();
    return res.status(200).json({ success: true, message: "Profile updated successfully.", data: { user: serializeUser(user) }, user: serializeUser(user) });
  } catch (_error) {
    return res.status(500).json({ success: false, message: "Unable to update the profile." });
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    const oldPassword = req.body?.oldPassword;
    const newPassword = req.body?.newPassword;
    if (!user || !oldPassword || !newPassword || newPassword.length < 8) return res.status(400).json({ success: false, message: "Provide your current password and a new password of at least 8 characters." });
    if (!(await bcrypt.compare(oldPassword, user.password))) return res.status(401).json({ success: false, message: "Current password is incorrect." });
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ success: true, message: "Password updated successfully.", data: {} });
  } catch (_error) {
    return res.status(500).json({ success: false, message: "Unable to update the password." });
  }
};

export const firebaseLogin = async (req, res) => {
  try {
    const token = req.body?.idToken;
    if (!token || !process.env.JWT_SECRET) return res.status(400).json({ success: false, message: "Firebase token is required." });
    const decoded = await verifyFirebaseToken(token);
    const email = decoded.email?.toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: "Firebase account has no email address." });
    let user = await User.findOne({ $or: [{ firebaseUid: decoded.uid }, { email }] }).select("+password");
    if (!user) user = await User.create({ name: decoded.name || email.split("@")[0], email, password: crypto.randomUUID(), firebaseUid: decoded.uid, photoURL: decoded.picture || "", avatar: decoded.picture || "" });
    else { user.firebaseUid = decoded.uid; user.photoURL = decoded.picture || user.photoURL; user.avatar = decoded.picture || user.avatar; await user.save(); }
    return sendAuth(res, 200, "Firebase sign-in successful.", user);
  } catch (_error) { return res.status(401).json({ success: false, message: "Firebase sign-in could not be verified." }); }
};

export const addAddress = async (req, res) => {
  const { label = "Home", fullName = "", phone = "", street = "", city = "", state = "", zip = "", country = "", isDefault = false } = req.body || {};
  if (!street || !city || !zip) return res.status(400).json({ success: false, message: "Street, city, and postal code are required." });
  const user = await User.findById(req.user._id);
  if (isDefault || !user.addresses.length) user.addresses.forEach((address) => { address.isDefault = false; });
  user.addresses.push({ label, fullName, phone, street, city, state, zip, country, isDefault: isDefault || !user.addresses.length });
  await user.save();
  return res.status(201).json({ success: true, message: "Address added.", data: { addresses: user.addresses } });
};

export const updateAddress = async (req, res) => {
  const user = await User.findById(req.user._id); const address = user?.addresses.id(req.params.addressId);
  if (!address) return res.status(404).json({ success: false, message: "Address not found." });
  Object.assign(address, req.body); if (req.body?.isDefault) user.addresses.forEach((item) => { item.isDefault = item._id.equals(address._id); });
  await user.save(); return res.status(200).json({ success: true, message: "Address updated.", data: { addresses: user.addresses } });
};

export const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id); const address = user?.addresses.id(req.params.addressId);
  if (!address) return res.status(404).json({ success: false, message: "Address not found." });
  address.deleteOne(); await user.save(); return res.status(200).json({ success: true, message: "Address deleted.", data: { addresses: user.addresses } });
};
