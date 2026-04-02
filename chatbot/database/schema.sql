
CREATE DATABASE IF NOT EXISTS chatbot;
USE chatbot;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','student') DEFAULT 'student',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- user_id FK links a student record to its login account
-- students.username JOIN users.username (roll_number = username) still works for auth
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roll_number VARCHAR(20),
  name VARCHAR(100),
  department VARCHAR(50),
  user_id INT UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS timetable (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department VARCHAR(50),
  day VARCHAR(20),
  subject VARCHAR(100),
  start_time TIME,
  end_time TIME
);

CREATE TABLE IF NOT EXISTS exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department VARCHAR(50),
  subject VARCHAR(100),
  exam_date DATE,
  exam_time TIME
);

CREATE TABLE IF NOT EXISTS fees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department VARCHAR(50),
  semester INT,
  semester_fee INT,
  exam_fee INT
);

-- One row per chat session belonging to a user
CREATE TABLE IF NOT EXISTS conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Each row = one Q&A exchange; belongs to a conversation session
CREATE TABLE IF NOT EXISTS query_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  conversation_id INT NOT NULL,
  question TEXT,
  response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);