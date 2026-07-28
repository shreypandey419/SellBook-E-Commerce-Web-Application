import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Admin from "../models/adminModel.js";

dotenv.config();

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || "SellBook Admin";

if (!email || !password) {
  process.stderr.write("ADMIN_EMAIL and ADMIN_PASSWORD must be set.\n");
  process.exit(1);
}

const seedAdmin = async () => {
  await connectDB();

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    process.stdout.write("An admin with this email already exists.\n");
  } else {
    await Admin.create({ name, email, password });
    process.stdout.write("Admin created successfully.\n");
  }

  await mongoose.disconnect();
};

seedAdmin().catch(async (error) => {
  process.stderr.write(`${error.message}\n`);
  await mongoose.disconnect();
  process.exit(1);
});
