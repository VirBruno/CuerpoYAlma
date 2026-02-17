import { useEffect, useState } from "react";
import {
  getAbonos,
  createAbono,
  deleteAbono,
  updateAbono,
} from "../services/abonos";
import { getAlumnas } from "../services/alumnas";
import Modal from "../components/Modal";

export default function Abonos() {
  const [editandoId, setEditandoId] = useState(null);
  const [abonos, setAbonos] = useState([]);
  const [alumnas, setAlumnas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [alumnaId, setAlumnaId] = useState("");
  const [mes, setMes] = useState("");
  const [clasesIncluidas, setClasesIncluidas] = useState("");
  const [clasesUsadas, setClasesUsadas] = useState("");
  const [clasesRecuperadas, setClasesRecuperadas] = useState("");
  const [fechaPago, setFechaPago] = useState("");

  const limpiarFormulario = () => {
    setEditandoId(null);
    setAlumnaId("");
    setMes("");
    setClasesIncluidas("");
    setClasesUsadas("");
    setClasesRecuperadas("");
    setFechaPago("");
  };

const cargarAlumnas = async () => {
  try {
    const res = await getAlumnas();
    setAlumnas(res.data);
  } catch (e) {
    console.error("Error cargando alumnas", e);
  }
};

const cargarAbonos = async () => {
  try {
    const res = await getAbonos();
    setAbonos(res.data);
  } catch (e) {
    console.error("Error cargando abonos", e);
  }
};

useEffect(() => {
  cargarAlumnas();
  cargarAbonos();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      alumna_id: Number(alumnaId),
      mes: Number(mes),
      clases_incluidas: Number(clasesIncluidas),
      clases_usadas: Number(clasesUsadas),
      clases_recuperadas: Number(clasesRecuperadas),
      fecha_pago: fechaPago || null,
    };

    console.log("ABONO PAYLOAD:", payload);

    if (editandoId) {
      await updateAbono(editandoId, payload);
    } else {
      await createAbono(payload);
    }

    limpiarFormulario();
    setModalOpen(false);
    cargarAbonos();
  };

  const handleEdit = (abono) => {
    setEditandoId(abono.id);
    setAlumnaId(abono.alumna_id);
    setMes(abono.mes);
    setClasesIncluidas(abono.clases_incluidas);
    setClasesUsadas(abono.clases_usadas);
    setClasesRecuperadas(abono.clases_recuperadas);
    setFechaPago(abono.fecha_pago);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteAbono(id);
    cargarAbonos();
  };

  return (
    <div>
      <h2>Abonos</h2>
      <button
              onClick={() => {
                limpiarFormulario();
                setModalOpen(true);
              }}
            >
              Crear Abono
            </button>
      
            <ul>
              {abonos.map((a) => (
                <li key={a.id}>
                  Alumna #{a.alumna_id} – {a.mes}
                  <button onClick={() => handleEdit(a)}>Editar</button>
                  <button onClick={() => handleDelete(a.id)}>Eliminar</button>
                </li>
              ))}
            </ul>
      
            <Modal
              isOpen={modalOpen}
              onClose={() => {
                setModalOpen(false);
                limpiarFormulario();
              }}
              title={editandoId ? "Editar Abono" : "Crear Abono"}
            >
              <form onSubmit={handleSubmit}>
                <p>Total alumnas: {alumnas.length}</p>
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

                <input type="number" value={mes} onChange={(e) => setMes(e.target.value)} placeholder="Mes" />
                <input type="number" value={clasesIncluidas} onChange={(e) => setClasesIncluidas(e.target.value)} placeholder="Clases Incluidas" />
                <input type="number" value={clasesUsadas} onChange={(e) => setClasesUsadas(e.target.value)} placeholder="Clases Usadas" />
                <input type="number" value={clasesRecuperadas} onChange={(e) => setClasesRecuperadas(e.target.value)} placeholder="Clases Recuperadas" />
                <input type="date" value={fechaPago} onChange={(e) => setFechaPago(e.target.value)} placeholder="Fecha Pago" />

                <button type="submit">
                  {editandoId ? "Guardar cambios" : "Crear abono"}
                </button>
              </form>
            </Modal>
    </div>
  );
}
