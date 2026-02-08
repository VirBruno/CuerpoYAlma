import api from "../api"; // tu api.js con axios.create

export const getSeguros = () => api.get("/seguros");

export const createSeguro = (data) =>
  api.post("/seguros", data);

export const updateSeguro = (id, data) =>
  api.put(`/seguros/${id}`, data);

export const deleteSeguro = (id) =>
  api.delete(`/seguros/${id}`);
