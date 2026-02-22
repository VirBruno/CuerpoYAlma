import api from "../api"; // tu api.js con axios.create

export const getAsistencias = () => api.get("/asistencias");

export const createAsistencia = (data) =>
  api.post("/asistencias", data);

export const updateAsistencia = (id, data) =>
  api.put(`/asistencias/${id}`, data);

export const deleteAsistencia = (id) =>
  api.delete(`/asistencias/${id}`);
