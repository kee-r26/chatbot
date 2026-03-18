
CREATE DATABASE college_chatbot;
USE college_chatbot;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roll_number VARCHAR(20),
  name VARCHAR(100),
  department VARCHAR(50)
);

CREATE TABLE timetable (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department VARCHAR(50),
  day VARCHAR(20),
  subject VARCHAR(100),
  start_time TIME,
  end_time TIME
);

CREATE TABLE exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department VARCHAR(50),
  subject VARCHAR(100),
  exam_date DATE,
  exam_time TIME
);

CREATE TABLE fees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department VARCHAR(50),
  semester INT,
  semester_fee INT,
  exam_fee INT
);

CREATE TABLE query_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  question TEXT,
  response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','student') DEFAULT 'student',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);