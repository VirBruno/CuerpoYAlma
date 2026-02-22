import api from "../api"; // tu api.js con axios.create
import client from "../client";

export const getResumen = (alumnaId, mes, anio) =>
  client.get(`/abonos/resumen/${alumnaId}?mes=${mes}&anio=${anio}`);


export const getAbonos = () => client.get("/abonos");

export const createAbono = (data) =>
  client.post("/abonos", data);

export const updateAbono = (id, data) =>
  client.put(`/abonos/${id}`, data);

export const deleteAbono = (id) =>
  client.delete(`/abonos/${id}`);