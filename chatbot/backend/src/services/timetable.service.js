import { db } from "../../db.js"

export async function getTimetable(department, day) {

  const [rows] = await db.query(
    `SELECT subject,start_time,end_time
     FROM timetable
     WHERE department=? AND day=?`,
    [department, day]
  )

  return rows
}