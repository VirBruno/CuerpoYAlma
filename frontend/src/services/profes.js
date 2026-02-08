import api from "../api"; // tu api.js con axios.create

export const getProfes = () => api.get("/profes");

export const createProfe = (data) =>
  api.post("/profes", data);

export const updateProfe = (id, data) =>
  api.put(`/profes/${id}`, data);

export const deleteProfe = (id) =>
  api.delete(`/profes/${id}`);
