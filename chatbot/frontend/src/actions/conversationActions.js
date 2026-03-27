import apiClient from "../api/apiClient";

export const createConversation = () =>
  apiClient.post("/conversations");

export const listConversations = () =>
  apiClient.get("/conversations");

export const getMessages = (id) =>
  apiClient.get(`/conversations/${id}/messages`);

export const updateTitle = (id, title) =>
  apiClient.patch(`/conversations/${id}`, { title });

export const deleteConversation = (id) =>
  apiClient.delete(`/conversations/${id}`);
