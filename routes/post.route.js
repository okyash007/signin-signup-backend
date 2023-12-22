import express from "express";
import { createPost, deletPost, likePost, updatePost } from "../controllers/post.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();
router.post("/create", verifyUser, createPost);
router.post("/update/:id", verifyUser, updatePost);
router.post("/like/:id", verifyUser, likePost);
router.delete("/delet/:id", verifyUser, deletPost);

export default router;
