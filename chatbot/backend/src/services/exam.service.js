import { db } from "../../db.js"

export async function getExamSchedule(department) {

  const [rows] = await db.query(
    `SELECT subject,exam_date,exam_time
     FROM exams
     WHERE department=?`,
    [department]
  )

  return rows
}