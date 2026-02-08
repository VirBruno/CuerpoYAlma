import { useEffect, useState } from "react";
import {
  getReservas,
  createReserva,
  deleteReserva,
  updateReserva,
} from "../services/reservas";
import { getAlumnas } from "../services/alumnas";
import { getClases } from "../services/clases";

export default function Reserva() {
  const [reservas, setReservas] = useState([]);
  const [alumnas, setAlumnas] = useState([]);
  const [clases, setClases] = useState([]);

  const [alumnaId, setAlumnaId] = useState("");
  const [claseId, setClaseId] = useState("");
  const [fechaClase, setFechaClase] = useState("");
  const [esRecuperacion, setEsRecuperacion] = useState(false);

  const [editandoId, setEditandoId] = useState(null);

  const cargarTodo = async () => {
    const [r, a, c] = await Promise.all([
      getReservas(),
      getAlumnas(),
      getClases(),
    ]);

    setReservas(r.data);
    setAlumnas(a.data);
    setClases(c.data);
  };
useEffect(() => {
  console.log("ALUMNAS RAW:", alumnas);
}, [alumnas]);

  useEffect(() => {
    cargarTodo();
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    alumna_id: Number(alumnaId),
    clase_id: Number(claseId),
    fecha_clase: new Date(fechaClase).toISOString(),
    es_recuperacion: esRecuperacion,
  };

  if (editandoId) {
    await updateReserva(editandoId, payload);
  } else {
    await createReserva(payload);
  }

  // reset total
  setEditandoId(null);
  setAlumnaId("");
  setClaseId("");
  setFechaClase("");
  setEsRecuperacion(false);

  cargarTodo();
};


const handleEdit = (reserva) => {
    setEditandoId(reserva.id);
    setAlumnaId(reserva.alumna_id);
    setClaseId(reserva.clase_id);
    setFechaClase(reserva.fecha_clase.slice(0, 16));
    setEsRecuperacion(reserva.es_recuperacion);
  };

const handleDelete = async (id) => {
  await deleteReserva(id);

  setEditandoId(null);
  setAlumnaId("");
  setClaseId("");
  setFechaClase("");
  setEsRecuperacion(false);

  cargarTodo();
};



  return (
    <div>
      <h2>Reservas</h2>

      <form onSubmit={handleSubmit}>
        {/* ALUMNA */}
        <select
          value={alumnaId}
          onChange={(e) => setAlumnaId(e.target.value)}
          required
        >
          <option value="">Seleccionar alumna</option>
          {alumnas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </select>



        {/* CLASE */}
        <select
          value={claseId}
          onChange={(e) => setClaseId(e.target.value)}
          required
        >
          <option value="">Seleccionar clase</option>
          {clases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.disciplina} – {c.dia} {c.hora}
            </option>
          ))}
        </select>

        {/* FECHA */}
        <input
          type="date"
          value={fechaClase}
          onChange={(e) => setFechaClase(e.target.value)}
          required
        />

        {/* RECUPERACIÓN */}
        <label>
          <input
            type="checkbox"
            checked={esRecuperacion}
            onChange={(e) => setEsRecuperacion(e.target.checked)}
          />
          Es recuperación
        </label>

        <button type="submit">  {editandoId ? "Guardar cambios" : "Crear reserva"}
        </button>
      </form>

      <ul>
        {reservas.map((r) => (
          <li key={r.id}>
            Alumna #{r.alumna_id} – Clase #{r.clase_id} –{" "}
            {new Date(r.fecha_clase).toLocaleString()} – {r.estado}
            <button onClick={() => handleEdit(r)}>Editar</button>
            <button onClick={() => handleDelete(r.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
