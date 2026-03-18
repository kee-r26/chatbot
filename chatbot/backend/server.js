import express from "express"
import cors from "cors"
import chatRoutes from "./src/routes/chat.routes.js"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/api", chatRoutes)

app.listen(5000, () => {
  console.log("Server running on port 5000")
}) 