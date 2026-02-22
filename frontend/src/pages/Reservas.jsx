import { useEffect, useState } from "react";
import {
  getReservas,
  createReserva,
  deleteReserva,
  updateReserva,
} from "../services/reservas";
import { getAlumnas } from "../services/alumnas";
import { getClases } from "../services/clases";
import Modal from "../components/Modal";
import api from "../api";


export default function Reserva() {
  const [reservas, setReservas] = useState([]);
  const [alumnas, setAlumnas] = useState([]);
  const [clases, setClases] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [alumnaId, setAlumnaId] = useState("");
  const [claseId, setClaseId] = useState("");
  const [fechaClase, setFechaClase] = useState("");
  const [esRecuperacion, setEsRecuperacion] = useState(false);

  const [editandoId, setEditandoId] = useState(null);

  const [cupoInfo, setCupoInfo] = useState(null);

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

  // reset total
  const limpiarFormulario = () => {
  setEditandoId(null);
  setAlumnaId("");
  setClaseId("");
  setFechaClase("");
  setEsRecuperacion(false);
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
    fecha_clase: fechaClase, // mejor así si backend usa date
    es_recuperacion: esRecuperacion,
  };

  if (editandoId) {
    await updateReserva(editandoId, payload);
  } else {
    await createReserva(payload);
  }

  limpiarFormulario();
  setModalOpen(false);
  cargarTodo();
};

useEffect(() => {
  if (claseId && fechaClase) {
    api
      .get("/reservas/cupo", {
        params: { clase_id: claseId, fecha: fechaClase },
      })
      .then((res) => setCupoInfo(res.data));
  }
}, [claseId, fechaClase]);


const handleEdit = (reserva) => {
    setEditandoId(reserva.id);
    setAlumnaId(reserva.alumna_id);
    setClaseId(reserva.clase_id);
    setFechaClase(reserva.fecha_clase.slice(0, 16));
    setEsRecuperacion(reserva.es_recuperacion);
    setModalOpen(true);
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

      <button
        onClick={() => {
          limpiarFormulario();
          setModalOpen(true);
        }}
      >
        Crear Reserva
      </button>

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

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          limpiarFormulario();
        }}
        title={editandoId ? "Editar Reserva" : "Crear Reserva"}
      >
      <form onSubmit={handleSubmit} className="form">
        {/* ALUMNA */}
      <div className="form-group"> 
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
      </div>
      <div className="form-group"> 
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
      </div>
      <div className="form-group"> 
        {/* FECHA */}
        <input
          type="date"
          value={fechaClase}
          onChange={(e) => setFechaClase(e.target.value)}
          required
        />
      </div>
      <div className="form-group"> 
        {cupoInfo && (
          <p>
            Cupo disponible: {cupoInfo.disponibles} / {cupoInfo.cupo_total}
          </p>
        )}

        {/* RECUPERACIÓN */}
        <label>
          <input
            type="checkbox"
            checked={esRecuperacion}
            onChange={(e) => setEsRecuperacion(e.target.checked)}
          />
          Es recuperación
        </label>
      </div>

  <button
    type="submit"
    disabled={cupoInfo && cupoInfo.disponibles <= 0}
  >
    Crear Reserva
  </button>

      </form>
      </Modal>

    </div>
  );
}
