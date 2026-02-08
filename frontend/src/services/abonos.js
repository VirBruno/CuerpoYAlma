import api from "../api"; // tu api.js con axios.create

export const getAbonos = () => api.get("/abonos");

export const createAbono = (data) =>
  api.post("/abonos", data);

export const updateAbono = (id, data) =>
  api.put(`/abonos/${id}`, data);

export const deleteAbono = (id) =>
  api.delete(`/abonos/${id}`);