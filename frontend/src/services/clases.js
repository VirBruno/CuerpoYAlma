import api from "../api"; // tu api.js con axios.create

export const getClases = () => api.get("/clases");

export const updateClase = (id, data) =>
  api.put(`/clases/${id}`, data);

export const createClase = (data) =>
  api.post("/clases", data);

export const deleteClase = (id) =>
  api.delete(`/clases/${id}`);
