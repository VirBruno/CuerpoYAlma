import { useEffect, useState } from "react";
import {
  getProfes,
  createProfe,
  deleteProfe,
  updateProfe,
} from "../services/profes";
import Modal from "../components/Modal";

export default function Profes() {
  const [profes, setProfes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const limpiarFormulario = () => {
    setNombre("");
    setDisciplina("");
    };

  const DISCIPLINAS = [
  "Pole fijo",
  "Pole giratorio",
  "Aro",
  "Flexibilidad",
  "Contemporáneo",
  "Entrenamiento acrobático",
  "Calistenia",
];

  const cargarProfes = async () => {
    const res = await getProfes();
    setProfes(res.data);
  };

  useEffect(() => {
    cargarProfes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = ({
      nombre,
      disciplina,
    });

    if (editandoId) {
      await updateProfe(editandoId, payload);
    } else {
      await createProfe(payload);
    }
    limpiarFormulario();
    setModalOpen(false);
    cargarProfes();
  };

    const handleEdit = (profe) => {
    setEditandoId(profe.id);
    setNombre(profe.nombre);
    setDisciplina(profe.disciplina);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteProfe(id);
    cargarProfes();
  };

  return (
    <div>
      <h2>Profes</h2>
      <button
        onClick={() => {
          limpiarFormulario();
          setModalOpen(true);
        }}
      >
        Crear Profe
      </button>
      <ul>
        {profes.map((a) => (
          <li key={a.id}>
            {a.nombre} (Disciplina {a.disciplina})
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
        title={editandoId ? "Editar Profe" : "Crear Profe"}
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
        <select
          value={disciplina}
          onChange={(e) => setDisciplina(e.target.value)}
          required
        >
          <option value="">Seleccionar disciplina</option>
          {DISCIPLINAS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">
        {editandoId ? "Guardar cambios" : "Crear profe"}
      </button>
      </form>
      </Modal>
    </div>
  );
}
