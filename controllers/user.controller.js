import User from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "hello world",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "you can only update your account!"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const update = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          fullname: req.body.fullname,
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...others } = update._doc;
    res.status(200).json(others);
  } catch (error) {
    next(error);
  }
};

export const deletUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "you can only deley your account!"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("acess_token").status(200).json("user has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getUserByUsername = async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    })
      .populate("posts")
      .select("-password");

    if (!user) return next(errorHandler(401, "no such user is there"));

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const searchUser = async (req, res, next) => {
  try {
    const users = await User.find({
      $or: [
        { username: new RegExp(req.query.text, "i") },
        { fullname: new RegExp(req.query.text, "i") },
      ],
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const follow = async (req, res, next) => {
  if (req.user.id !== req.body.user)
    return next(errorHandler(401, "user is not authraized"));

  try {
    const user = await User.findById(req.body.user).select("-password");
    if (!user) return next(errorHandler(401, "no such user is there"));

    const user2 = await User.findById(req.params.id).select("-password");
    if (!user2) return next(errorHandler(401, "no such user is there"));

    const isFollowed =
      user.following.includes(req.params.id) ||
      user2.followers.includes(req.body.user);

    if (isFollowed) {
      user.following.pull(req.params.id);
      user2.followers.pull(req.body.user);
    } else {
      user.following.push(req.params.id);
      user2.followers.push(req.body.user);
    }

    await user.save();
    await user2.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
