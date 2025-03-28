import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },

  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please provide a password"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,

  about: {
    type: String,
    default: "",
    trim: true,
    validate: {
      validator: function (v) {
        return v.trim().length <= 500;
      },
      message: "About section cannot exceed 500 characters.",
    },
  },

  specialties: {
    type: [String],
    default: [],
    validate: {
      validator: function (v) {
        return v.length <= 10;
      },
      message: "You can specify up to 10 specialties.",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
