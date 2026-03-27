/**
 * seed.js — inserts a test student + admin user so you can log in immediately.
 * Run once: node seed.js
 */
import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const studentHash = await bcrypt.hash("student123", 10);
const adminHash = await bcrypt.hash("admin123", 10);

// Insert users
await db.execute(
  "INSERT IGNORE INTO users (username, password_hash, role) VALUES (?, ?, 'student')",
  ["JOHN001", studentHash]
);
await db.execute(
  "INSERT IGNORE INTO users (username, password_hash, role) VALUES (?, ?, 'admin')",
  ["ADMIN001", adminHash]
);

// Get the student user_id
const [[studentUser]] = await db.execute(
  "SELECT user_id FROM users WHERE username = 'CS001'"
);

// Insert student record linked to user
await db.execute(
  `INSERT IGNORE INTO students (roll_number, name, department, user_id)
   VALUES ('CS001', 'Test Student', 'CSE', ?)`,
  [studentUser.user_id]
);

// Seed some timetable data for CSE
const timetableRows = [
  ["CSE", "Monday", "Data Structures", "09:00:00", "10:00:00"],
  ["CSE", "Monday", "Operating Systems", "10:00:00", "11:00:00"],
  ["CSE", "Monday", "DBMS", "11:00:00", "12:00:00"],
  ["CSE", "Tuesday", "Computer Networks", "09:00:00", "10:00:00"],
  ["CSE", "Tuesday", "Software Engineering", "10:00:00", "11:00:00"],
];
for (const [dept, day, subject, start, end] of timetableRows) {
  await db.execute(
    "INSERT IGNORE INTO timetable (department, day, subject, start_time, end_time) VALUES (?, ?, ?, ?, ?)",
    [dept, day, subject, start, end]
  );
}

// Seed exam data
const examRows = [
  ["CSE", "Data Structures", "2025-04-10", "10:00:00"],
  ["CSE", "Operating Systems", "2025-04-12", "14:00:00"],
  ["CSE", "DBMS", "2025-04-15", "10:00:00"],
];
for (const [dept, subject, date, time] of examRows) {
  await db.execute(
    "INSERT IGNORE INTO exams (department, subject, exam_date, exam_time) VALUES (?, ?, ?, ?)",
    [dept, subject, date, time]
  );
}

// Seed fees
const feesRows = [
  ["CSE", 1, 45000, 1500],
  ["CSE", 2, 45000, 1500],
  ["CSE", 3, 48000, 1500],
  ["CSE", 4, 48000, 1500],
];
for (const [dept, sem, semFee, examFee] of feesRows) {
  await db.execute(
    "INSERT IGNORE INTO fees (department, semester, semester_fee, exam_fee) VALUES (?, ?, ?, ?)",
    [dept, sem, semFee, examFee]
  );
}

await db.end();
console.log("Seed complete.");
console.log("  Student login -> username: CS001  password: student123");
console.log("  Admin login   -> username: admin  password: admin123");
