-- Run this against your existing college_chatbot database
-- to add the new tables/columns needed for conversation history.
-- Safe to run multiple times (uses IF NOT EXISTS / IF EXISTS guards).

USE college_chatbot;

-- 1. Add user_id FK to students (if not already present)
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS user_id INT UNIQUE,
  ADD CONSTRAINT IF NOT EXISTS fk_students_user
    FOREIGN KEY (user_id) REFERENCES users(user_id);

-- 2. Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 3. Add conversation_id to query_history (if not already present)
ALTER TABLE query_history
  ADD COLUMN IF NOT EXISTS conversation_id INT AFTER student_id,
  ADD CONSTRAINT IF NOT EXISTS fk_qh_conversation
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;
