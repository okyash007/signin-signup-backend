import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      requied: true,
      unique: true,
    },
    email: {
      type: String,
      requied: true,
      unique: true,
    },
    password: {
      type: String,
      requied: true,
    },
    avatar: {
      type: String,
      default:
        "https://as.nyu.edu/content/dam/nyu-as/faculty/images/profilePhotos/profile-image-placeholder.png",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
