import Post from "../models/posts.models.js";
import User from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  const { text, image, user } = req.body;

  if (req.user.id !== user) {
    return next(errorHandler(401, "you can only post with your account!"));
  }

  const newPost = new Post({
    text,
    image,
    user,
  });

  try {
    await newPost.save();

    const owner = await User.findById(user);

    if (!owner) return next(errorHandler(401, "No such user is there"));

    owner.posts.push(newPost._id);

    await owner.save();

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(errorHandler(401, "No such post is there"));

    if (post.user.toString() !== req.user.id)
      return next(errorHandler(401, "you can only edit your post"));

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          text: req.body.text,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  if (req.user.id !== req.body.userid) {
    return next(
      errorHandler(401, "you are not signed in with correct account ")
    );
  }

  try {
    const user = await User.findById(req.body.userid);
    if (!user) return next(errorHandler(401, "No such user is there"));
    const post = await Post.findById(req.params.id);
    if (!post) return next(errorHandler(401, "No such post is there"));

    const isLiked =
      post.likes.includes(user._id) || user.likes.includes(post._id);

    if (isLiked) {
      user.likes.pull(post._id);
      post.likes.pull(user._id);
    } else {
      user.likes.push(post._id);
      post.likes.push(user._id);
    }
    await user.save();
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const deletPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.user.id)
      return next(errorHandler(401, "you can only delet your post"));

    const user = await User.findById(post.user);

    user.posts.pull(req.params.id);

    await user.save();

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json("post deleted");
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "-password")
      .populate("likes");

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("user", "-password");
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
