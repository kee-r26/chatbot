import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import chatRoutes from "./src/routes/chat.routes.js"
import conversationRoutes from "./src/routes/conversation.routes.js"
import uploadRoutes from "./src/routes/upload.routes.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/api", chatRoutes)
app.use("/api", conversationRoutes)
app.use("/api", uploadRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})