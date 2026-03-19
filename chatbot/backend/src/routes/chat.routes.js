import express from "express";
import { chatHandler } from "../controllers/chat.controller.js";
import { login } from "../controllers/user.controller.js";
import { createHash } from "../controllers/hash.controller.js";
import { verifyToken } from "../middleware/auth.js"; // Import middleware

const router = express.Router();

router.post("/chat", verifyToken, chatHandler); // Protect the chat route
router.post("/login", login);
router.post("/hash", createHash);

export default router;
