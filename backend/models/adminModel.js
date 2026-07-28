import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },
    role: {
      type: String,
      default: "admin",
      enum: ["admin"],
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

adminSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;
