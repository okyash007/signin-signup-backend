import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { makeAdmin } from "../controllers/owner.controller.js";

const router = express.Router();
router.post("/makeadmin/:id", verifyUser, makeAdmin);

export default router;
