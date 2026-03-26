import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password is required if googleId is not provided
      },
    },
    googleId: {
      type: String,
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

userSchema.clearIndexes({ googleId: 1 }, { sparse: true, unique: true }); // Sparse allows multiple documents with null googleId

const User = mongoose.model("User", userSchema);

export default User;
