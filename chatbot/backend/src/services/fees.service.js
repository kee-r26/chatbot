import { db } from "../../db.js"

export async function getFees(department) {

  const [rows] = await db.query(
    `SELECT semester, semester_fee, exam_fee
     FROM fees
     WHERE department = ?`,
    [department]
  )

  return rows
}