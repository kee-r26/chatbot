import { db } from "../../db.js"

export async function createConversation(req, res) {
  try {
    const userId = req.user.userId

    const [result] = await db.execute(
      "INSERT INTO conversations (user_id, title) VALUES (?, 'New Conversation')",
      [userId]
    )

    const [rows] = await db.execute(
      "SELECT id, title, created_at, updated_at FROM conversations WHERE id = ?",
      [result.insertId]
    )

    res.status(201).json(rows[0])
  } catch (error) {
    console.error("createConversation error:", error)
    res.status(500).json({ message: "Failed to create conversation" })
  }
}

export async function listConversations(req, res) {
  try {
    const userId = req.user.userId

    const [rows] = await db.execute(
      `SELECT id, title, created_at, updated_at
       FROM conversations
       WHERE user_id = ?
       ORDER BY updated_at DESC`,
      [userId]
    )

    res.json(rows)
  } catch (error) {
    console.error("listConversations error:", error)
    res.status(500).json({ message: "Failed to fetch conversations" })
  }
}

export async function getMessages(req, res) {
  try {
    const userId = req.user.userId
    const conversationId = req.params.id

    // Ownership check
    const [conv] = await db.execute(
      "SELECT id FROM conversations WHERE id = ? AND user_id = ?",
      [conversationId, userId]
    )
    if (conv.length === 0) {
      return res.status(403).json({ message: "Access denied" })
    }

    const [rows] = await db.execute(
      `SELECT question, response, created_at
       FROM query_history
       WHERE conversation_id = ?
       ORDER BY created_at ASC`,
      [conversationId]
    )

    // Expand each row into two message objects: user then bot
    const messages = []
    rows.forEach((row) => {
      messages.push({ role: "user", text: row.question, created_at: row.created_at })
      messages.push({ role: "bot", text: row.response, created_at: row.created_at })
    })

    res.json(messages)
  } catch (error) {
    console.error("getMessages error:", error)
    res.status(500).json({ message: "Failed to fetch messages" })
  }
}

export async function updateTitle(req, res) {
  try {
    const userId = req.user.userId
    const conversationId = req.params.id
    const { title } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" })
    }

    // Ownership check
    const [conv] = await db.execute(
      "SELECT id FROM conversations WHERE id = ? AND user_id = ?",
      [conversationId, userId]
    )
    if (conv.length === 0) {
      return res.status(403).json({ message: "Access denied" })
    }

    await db.execute(
      "UPDATE conversations SET title = ? WHERE id = ?",
      [title.trim().slice(0, 255), conversationId]
    )

    res.json({ message: "Title updated" })
  } catch (error) {
    console.error("updateTitle error:", error)
    res.status(500).json({ message: "Failed to update title" })
  }
}

export async function deleteConversation(req, res) {
  try {
    const userId = req.user.userId
    const conversationId = req.params.id

    // Ownership check
    const [conv] = await db.execute(
      "SELECT id FROM conversations WHERE id = ? AND user_id = ?",
      [conversationId, userId]
    )
    if (conv.length === 0) {
      return res.status(403).json({ message: "Access denied" })
    }

    // query_history rows cascade-delete via FK
    await db.execute("DELETE FROM conversations WHERE id = ?", [conversationId])

    res.json({ message: "Conversation deleted" })
  } catch (error) {
    console.error("deleteConversation error:", error)
    res.status(500).json({ message: "Failed to delete conversation" })
  }
}
