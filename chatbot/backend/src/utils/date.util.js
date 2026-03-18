export function getDayFromEntity(entity) {

  const today = new Date()

  if (entity === "today") {
    return today.toLocaleDateString("en-US", { weekday: "long" })
  }

  if (entity === "tomorrow") {
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)

    return tomorrow.toLocaleDateString("en-US", {
      weekday: "long"
    })
  }

  if (entity === "yesterday") {
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)
    return yesterday.toLocaleDateString("en-US", {
      weekday: "long"
    })
  }

  return entity
}