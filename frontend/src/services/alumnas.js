import api from "../api"; // tu api.js con axios.create
import client from "../client";

export const getAlumnas = () => client.get("/alumnas");

export const createAlumna = (data) =>
  client.post("/alumnas", data);

export const updateAlumna = (id, data) =>
  client.put(`/alumnas/${id}`, data);

export const deleteAlumna = (id) =>
  client.delete(`/alumnas/${id}`);