/**
 * Parses a plain-text bot reply string into a structured object for rendering.
 *
 * Single-line  → { type: 'text', content: string }
 * Multiline    → { type: 'table', heading: string, rows: Array<{ left: string, right: string }> }
 *
 * The backend emits multiline replies in this shape:
 *   "Heading line:\nLEFT : RIGHT\nLEFT : RIGHT"
 *
 * For exam replies the separator is " - " and " (time)" — handled as a single right-hand column.
 */
export function formatReply(reply) {
  if (!reply || typeof reply !== "string") {
    return { type: "text", content: "No response received." };
  }

  const lines = reply.split("\n").filter((l) => l.trim() !== "");

  if (lines.length <= 1) {
    return { type: "text", content: reply.trim() };
  }

  const heading = lines[0];
  const dataLines = lines.slice(1);

  const rows = dataLines.map((line) => {
    // Primary split on " : " (timetable / fees)
    const sepIdx = line.indexOf(" : ");
    if (sepIdx !== -1) {
      return {
        left: line.slice(0, sepIdx).trim(),
        right: line.slice(sepIdx + 3).trim(),
      };
    }
    // Fallback: treat whole line as right column
    return { left: "", right: line.trim() };
  });

  return { type: "table", heading, rows };
}
