import mysql from "mysql2/promise"

export const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "college_helpdesk_chatbot"
})