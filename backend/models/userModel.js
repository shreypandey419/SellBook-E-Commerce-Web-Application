import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
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
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
      minlength: 8,
      select: false,
    },
    phone: {
      type: String,
    },
    avatar: {
      type: String,
    },
    firebaseUid: { type: String, unique: true, sparse: true, index: true },
    photoURL: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    pincode: { type: String, default: "" },
    defaultAddressId: { type: mongoose.Schema.Types.ObjectId, default: null },
    addresses: [
      {
        label: { type: String, default: "Home" },
        fullName: { type: String, default: "" },
        phone: { type: String, default: "" },
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
