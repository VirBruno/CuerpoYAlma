import api from "../api"; // tu api.js con axios.create

export const getAlumnas = () => api.get("/alumnas");

export const createAlumna = (data) =>
  api.post("/alumnas", data);

export const updateAlumna = (id, data) =>
  api.put(`/alumnas/${id}`, data);

export const deleteAlumna = (id) =>
  api.delete(`/alumnas/${id}`);