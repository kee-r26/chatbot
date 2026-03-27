import apiClient from "../api/apiClient";

export async function uploadCSV(dataType, file) {
  const form = new FormData();
  form.append("dataType", dataType);
  form.append("file", file);
  const res = await apiClient.post("/upload/csv", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function addFormData(dataType, data) {
  const res = await apiClient.post("/upload/form", { dataType, ...data });
  return res.data;
}
