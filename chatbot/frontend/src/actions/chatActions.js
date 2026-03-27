import apiClient from "../api/apiClient";

export async function sendMessage(message, conversationId) {
  const res = await apiClient.post("/chat", { message, conversationId });
  return res.data.reply;
}
