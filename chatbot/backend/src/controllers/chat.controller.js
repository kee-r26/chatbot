import { detectIntent } from "../services/intent.service.js"
import { detectDateEntity } from "../services/entity.service.js"
import { getDayFromEntity } from "../utils/date.util.js"

import { getTimetable } from "../services/timetable.service.js"
import { getExamSchedule } from "../services/exam.service.js"
import { getFees } from "../services/fees.service.js"

export async function chatHandler(req, res) {

  const { message, department } = req.body

  const intent = detectIntent(message)
  const entity = detectDateEntity(message)
  const day = getDayFromEntity(entity || "today")

  try {

    // TIMETABLE INTENT
    if (intent === "timetable") {

      const classes = await getTimetable(department, day)

      if (classes.length === 0) {
        return res.json({ reply: "No classes found for that day." })
      }

      let reply = `Your classes on ${day}:\n`

      classes.forEach(c => {
        reply += `${c.start_time} - ${c.end_time} : ${c.subject}\n`
      })

      return res.json({ reply })
    }

    // EXAM SCHEDULE INTENT
    if (intent === "exam") {

      const exams = await getExamSchedule(department)

      if (exams.length === 0) {
        return res.json({ reply: "No exams scheduled." })
      }

      let reply = "Upcoming exams:\n"

      exams.forEach(e => {
        reply += `${e.subject} - ${e.exam_date} (${e.exam_time})\n`
      })

      return res.json({ reply })
    }

    // SEMESTER FEE INTENT
    if (intent === "semester_fee") {

      const fees = await getFees(department)

      if (fees.length === 0) {
        return res.json({ reply: "No semester fee information available." })
      }

      let reply = "Semester tuition fees:\n"

      fees.forEach(f => {
        reply += `Semester ${f.semester}: ₹${f.semester_fee}\n`
      })

      return res.json({ reply })
    }

    // EXAM FEE INTENT
    if (intent === "exam_fee") {

      const fees = await getFees(department)

      if (fees.length === 0) {
        return res.json({ reply: "No exam fee information available." })
      }

      let reply = "Exam fees:\n"

      fees.forEach(f => {
        reply += `Semester ${f.semester}: ₹${f.exam_fee}\n`
      })

      return res.json({ reply })
    }

    // BOTH FEES INTENT
    if (intent === "fees") {

      const fees = await getFees(department)

      if (fees.length === 0) {
        return res.json({ reply: "No fee information available." })
      }

      let reply = "Fees details:\n"

      fees.forEach(f => {
        reply += `Semester ${f.semester}: Semester Fee ₹${f.semester_fee}, Exam Fee ₹${f.exam_fee}\n`
      })

      return res.json({ reply })
    }

    // FALLBACK
    return res.json({
      reply: "Sorry, I didn't understand your question. You can ask about timetable, exams, or fees."
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ reply: "Something went wrong" })
  }
}