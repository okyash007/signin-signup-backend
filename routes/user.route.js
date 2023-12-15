import express from "express";
import { deletUser, test, updateUser } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();
router.get("/test", test);
router.post("/update/:id", verifyUser, updateUser);
router.delete("/delet/:id", verifyUser, deletUser);

export default router;
