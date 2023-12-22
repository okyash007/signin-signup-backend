import express from "express";
import {
  deletUser,
  follow,
  getUserByUsername,
  searchUser,
  test,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();
router.get("/test", test);
router.post("/update/:id", verifyUser, updateUser);
router.delete("/delet/:id", verifyUser, deletUser);
router.get("/profile/:username", getUserByUsername);
router.get("/search", searchUser);
router.post("/follow/:id", verifyUser, follow);

export default router;
