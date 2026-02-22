import { useEffect, useState } from "react";
import {
  getAlumnas,
  createAlumna,
  deleteAlumna,
  updateAlumna,
} from "../services/alumnas";
import { getSeguros } from "../services/seguros";
import Modal from "../components/Modal";

export default function Alumnas() {
  const [alumnas, setAlumnas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [dni, setDni] = useState("");
  const [seguroId, setSeguroId] = useState("");
  const [seguros, setSeguros] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const cargarAlumnas = async () => {
    const res = await getAlumnas();
    setAlumnas(res.data);
  };

  const cargarSeguros = async () => {
    try {
      const res = await getSeguros();
      setSeguros(res.data);
    } catch (e) {
      console.error("Error cargando seguros", e);
    }
  };

  useEffect(() => {
    cargarAlumnas();
    cargarSeguros();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setEdad("");
    setDni("");
    setSeguroId("");
    setEditandoId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombre,
      edad: Number(edad),
      dni,
      seguro_id: Number(seguroId),
    };

    if (editandoId) {
      await updateAlumna(editandoId, payload);
    } else {
      await createAlumna(payload);
    }

    limpiarFormulario();
    setModalOpen(false);
    cargarAlumnas();
  };

  const handleEdit = (alumna) => {
    setEditandoId(alumna.id);
    setNombre(alumna.nombre);
    setEdad(alumna.edad);
    setDni(alumna.dni);
    setSeguroId(alumna.seguro_id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteAlumna(id);
    cargarAlumnas();
  };

  return (
    <div>
      <h2>Alumnas</h2>

      <button
        onClick={() => {
          limpiarFormulario();
          setModalOpen(true);
        }}
      >
        Crear Alumna
      </button>

      <ul>
        {alumnas.map((a) => (
          <li key={a.id}>
            {a.nombre} (DNI {a.dni})
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
        title={editandoId ? "Editar Alumna" : "Crear Alumna"}
      >
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
          <input
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          </div>
          <div className="form-group">
          <input
            placeholder="Edad"
            type="number"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            required
          />
          </div>
          <div className="form-group">
          <input
            placeholder="DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
          />
          </div>
          <div className="form-group">
          <select
            value={seguroId}
            onChange={(e) => setSeguroId(e.target.value)}
            required
          >
            <option value="">Seleccionar seguro</option>
            {seguros.map((s) => (
              <option key={s.id} value={s.id}>
                {s.numero}
              </option>
            ))}
          </select>
          </div>
          <button type="submit">
            {editandoId ? "Actualizar" : "Crear"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
