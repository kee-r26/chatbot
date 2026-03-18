export function detectDateEntity(message) {

  const text = message.toLowerCase()

  if (text.includes("tomorrow") || text.includes("tmr") || text.includes("tmrw"))
    return "tomorrow"

  if (text.includes("today") || text.includes("tdy") || text.includes("td"))
    return "today"

  if (text.includes("yesterday") || text.includes("ystrdy") || text.includes("ystrd"))
    return "yesterday"

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday"
  ]

  for (const day of days) {
    if (text.includes(day)) {
      return day.charAt(0).toUpperCase() + day.slice(1)
    }
  }

  return null
}