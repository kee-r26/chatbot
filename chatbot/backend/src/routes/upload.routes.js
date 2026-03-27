import express from "express"
import multer from "multer"
import { verifyToken } from "../middleware/auth.js"
import { uploadCSV, addFormData } from "../controllers/upload.controller.js"

const router = express.Router()

// Store file in memory buffer so csv-parser can read it without disk I/O
const upload = multer({ storage: multer.memoryStorage() })

router.post("/upload/csv", verifyToken, upload.single("file"), uploadCSV)
router.post("/upload/form", verifyToken, addFormData)

export default router
