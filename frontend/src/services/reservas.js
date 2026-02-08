import api from "../api"; // tu api.js con axios.create

export const getReservas = () => api.get("/reservas");

export const createReserva = (data) =>
  api.post("/reservas", data);

export const updateReserva = (id, data) =>
  api.put(`/reservas/${id}`, data);

export const deleteReserva = (id) =>
  api.delete(`/reservas/${id}`);
