/**
 * migrate.js — Applies the full schema to the database.
 * Safe to run on a fresh or partially populated DB.
 * Delete this file after first run if you want to keep the project clean.
 */
import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const statements = [
  // Users must come first (FK target for students, conversations)
  `CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','student') DEFAULT 'student',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(20),
    name VARCHAR(100),
    department VARCHAR(50),
    user_id INT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )`,

  `CREATE TABLE IF NOT EXISTS timetable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(50),
    day VARCHAR(20),
    subject VARCHAR(100),
    start_time TIME,
    end_time TIME
  )`,

  `CREATE TABLE IF NOT EXISTS exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(50),
    subject VARCHAR(100),
    exam_date DATE,
    exam_time TIME
  )`,

  `CREATE TABLE IF NOT EXISTS fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(50),
    semester INT,
    semester_fee INT,
    exam_fee INT
  )`,

  `CREATE TABLE IF NOT EXISTS conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )`,

  `CREATE TABLE IF NOT EXISTS query_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    conversation_id INT,
    question TEXT,
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
  )`,
];

const labels = [
  "users", "students", "timetable", "exams", "fees", "conversations", "query_history",
];

for (let i = 0; i < statements.length; i++) {
  try {
    await db.execute(statements[i]);
    console.log(`[OK]  ${labels[i]}`);
  } catch (err) {
    console.log(`[ERR] ${labels[i]}: ${err.message}`);
  }
}

// Verify
const [tables] = await db.execute("SHOW TABLES");
console.log("\n=== Tables now in", process.env.DB_NAME, "===");
tables.forEach((t) => console.log(" -", Object.values(t)[0]));

await db.end();
console.log("\nDone.");
