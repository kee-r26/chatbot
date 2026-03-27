import express from "express"
import { verifyToken } from "../middleware/auth.js"
import {
  createConversation,
  listConversations,
  getMessages,
  updateTitle,
  deleteConversation,
} from "../controllers/conversation.controller.js"

const router = express.Router()

router.post("/conversations", verifyToken, createConversation)
router.get("/conversations", verifyToken, listConversations)
router.get("/conversations/:id/messages", verifyToken, getMessages)
router.patch("/conversations/:id", verifyToken, updateTitle)
router.delete("/conversations/:id", verifyToken, deleteConversation)

export default router
