import { templates } from "../config/templates.js"
import { normalizeSynonyms } from "../utils/synonym.util.js"

export function detectIntent(message) {

  const normalized = normalizeSynonyms(message.toLowerCase())

  for (const intentObj of templates) {
    for (const pattern of intentObj.patterns) {
      if (normalized.includes(pattern)) {
        return intentObj.intent
      }
    }
  }

  return "unknown"
}