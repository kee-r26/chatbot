import { db } from "../../db.js"
import { detectIntent } from "../services/intent.service.js"
import { detectDateEntity } from "../services/entity.service.js"
import { getDayFromEntity } from "../utils/date.util.js"
import { getTimetable } from "../services/timetable.service.js"
import { getExamSchedule } from "../services/exam.service.js"
import { getFees } from "../services/fees.service.js"

export const chatHandler = async (req, res) => {
  const { message, conversationId } = req.body

  // department is embedded in the JWT by auth.service.js at login time
  const department = req.user.department
  const userId = req.user.userId

  const intent = detectIntent(message)
  const entity = detectDateEntity(message)
  const day = getDayFromEntity(entity || "today")

  let reply = ""

  try {
    // TIMETABLE INTENT
    if (intent === "timetable") {
      const classes = await getTimetable(department, day)

      if (classes.length === 0) {
        reply = "No classes found for that day."
      } else {
        reply = `Your classes on ${day}:\n`
        classes.forEach((c) => {
          reply += `${c.start_time} - ${c.end_time} : ${c.subject}\n`
        })
        reply = reply.trimEnd()
      }
    }

    // EXAM SCHEDULE INTENT
    else if (intent === "exam") {
      const exams = await getExamSchedule(department)

      if (exams.length === 0) {
        reply = "No exams scheduled."
      } else {
        reply = "Upcoming exams:\n"
        exams.forEach((e) => {
          reply += `${e.subject} - ${e.exam_date} (${e.exam_time})\n`
        })
        reply = reply.trimEnd()
      }
    }

    // SEMESTER FEE INTENT
    else if (intent === "semester_fee") {
      const fees = await getFees(department)

      if (fees.length === 0) {
        reply = "No semester fee information available."
      } else {
        reply = "Semester tuition fees:\n"
        fees.forEach((f) => {
          reply += `Semester ${f.semester} : ₹${f.semester_fee}\n`
        })
        reply = reply.trimEnd()
      }
    }

    // EXAM FEE INTENT
    else if (intent === "exam_fee") {
      const fees = await getFees(department)

      if (fees.length === 0) {
        reply = "No exam fee information available."
      } else {
        reply = "Exam fees:\n"
        fees.forEach((f) => {
          reply += `Semester ${f.semester} : ₹${f.exam_fee}\n`
        })
        reply = reply.trimEnd()
      }
    }

    // BOTH FEES INTENT
    else if (intent === "fees") {
      const fees = await getFees(department)

      if (fees.length === 0) {
        reply = "No fee information available."
      } else {
        reply = "Fees details:\n"
        fees.forEach((f) => {
          reply += `Semester ${f.semester} : Semester Fee ₹${f.semester_fee}, Exam Fee ₹${f.exam_fee}\n`
        })
        reply = reply.trimEnd()
      }
    }

    // FALLBACK
    else {
      reply = "Sorry, I didn't understand your question. You can ask about timetable, exams, or fees."
    }

    // Persist the exchange to query_history if a valid conversation is active
    if (conversationId) {
      await db.execute(
        "INSERT INTO query_history (student_id, conversation_id, question, response) VALUES (?, ?, ?, ?)",
        [userId, conversationId, message, reply]
      )
      await db.execute(
        "UPDATE conversations SET updated_at = NOW() WHERE id = ?",
        [conversationId]
      )
    }

    return res.json({ reply })
  } catch (error) {
    console.error("chatHandler error:", error)
    return res.status(500).json({ reply: "Something went wrong. Please try again." })
  }
}
