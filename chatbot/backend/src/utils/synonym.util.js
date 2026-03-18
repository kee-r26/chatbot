import { synonyms } from "../config/synonyms.js"

export function normalizeSynonyms(text) {

  let words = text.split(" ")

  words = words.map(word => {

    for (const key in synonyms) {

      if (synonyms[key].includes(word)) {
        return key
      }

    }

    return word
  })

  return words.join(" ")
}