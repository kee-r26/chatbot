import { db } from "../../db.js"
import csv from "csv-parser"
import { Readable } from "stream"

// Maps frontend dataType label to DB table name and expected CSV columns
const DATA_TYPE_MAP = {
  Timetable: {
    table: "timetable",
    columns: ["department", "day", "subject", "start_time", "end_time"],
  },
  "Exam Schedule": {
    table: "exams",
    columns: ["department", "subject", "exam_date", "exam_time"],
  },
  Fees: {
    table: "fees",
    columns: ["department", "semester", "semester_fee", "exam_fee"],
  },
}

function adminOnly(req, res) {
  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Admin access required" })
    return false
  }
  return true
}

export async function uploadCSV(req, res) {
  if (!adminOnly(req, res)) return

  const { dataType } = req.body
  const config = DATA_TYPE_MAP[dataType]

  if (!config) {
    return res.status(400).json({ message: `Unsupported data type: ${dataType}` })
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" })
  }

  try {
    const rows = []

    await new Promise((resolve, reject) => {
      Readable.from(req.file.buffer)
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", resolve)
        .on("error", reject)
    })

    if (rows.length === 0) {
      return res.status(400).json({ message: "CSV file is empty" })
    }

    // Build bulk INSERT
    const placeholders = rows.map(() => `(${config.columns.map(() => "?").join(", ")})`).join(", ")
    const values = rows.flatMap((row) => config.columns.map((col) => row[col] ?? null))

    await db.execute(
      `INSERT INTO ${config.table} (${config.columns.join(", ")}) VALUES ${placeholders}`,
      values
    )

    res.json({ message: `${rows.length} ${dataType} record(s) inserted successfully` })
  } catch (error) {
    console.error("uploadCSV error:", error)
    res.status(500).json({ message: "Failed to process CSV file" })
  }
}

export async function addFormData(req, res) {
  if (!adminOnly(req, res)) return

  const { dataType, ...fields } = req.body
  const config = DATA_TYPE_MAP[dataType]

  if (!config) {
    return res.status(400).json({ message: `Unsupported data type: ${dataType}` })
  }

  // Remap camelCase frontend field names to snake_case DB column names
  const fieldMap = {
    startTime: "start_time",
    endTime: "end_time",
    examDate: "exam_date",
    examTime: "exam_time",
    semesterFee: "semester_fee",
    examFee: "exam_fee",
  }

  const normalised = {}
  for (const [key, value] of Object.entries(fields)) {
    const dbKey = fieldMap[key] || key
    normalised[dbKey] = value
  }

  try {
    const cols = config.columns.filter((col) => normalised[col] !== undefined)
    const vals = cols.map((col) => normalised[col])

    if (cols.length === 0) {
      return res.status(400).json({ message: "No valid fields provided" })
    }

    await db.execute(
      `INSERT INTO ${config.table} (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`,
      vals
    )

    res.status(201).json({ message: `${dataType} record added successfully` })
  } catch (error) {
    console.error("addFormData error:", error)
    res.status(500).json({ message: "Failed to insert data" })
  }
}
