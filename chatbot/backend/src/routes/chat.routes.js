
import express from "express";
import { chatHandler } from "../controllers/chat.controller.js";
import { login } from "../controllers/user.controller.js";
import { createHash } from "../controllers/hash.controller.js";

const router = express.Router();

router.post("/chat", chatHandler);
router.post("/login", login);
router.post("/hash", createHash);

export default router;
