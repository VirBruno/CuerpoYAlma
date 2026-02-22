import { useEffect, useState } from "react";
import {
  getClases,
  createClase,
  updateClase,
  deleteClase,
} from "../services/clases";
import { getProfes } from "../services/profes";
import Modal from "../components/Modal";

export default function Clases() {
  const [clases, setClases] = useState([]);

  const [disciplina, setDisciplina] = useState("");
  const [dia, setDia] = useState("");
  const [hora, setHora] = useState("");
  const [nivel, setNivel] = useState("");
  const [profeId, setProfeId] = useState("");
  const [cantidadAlumnas, setCantidadAlumnas] = useState(0);
  const [profes, setProfes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const limpiarFormulario = () => {
      // reset
    setEditandoId(null);
    setDisciplina("");
    setDia("");
    setHora("");
    setNivel("");
    setProfeId("");
    setCantidadAlumnas(0);
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

const NIVEL = [
  "Principiante",
  "Intermedio",
  "Avanzado",
  "Todos",
];

const DIA = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

  const cargarClases = async () => {
    const res = await getClases();
    setClases(res.data);
  };

    const cargarProfes = async () => {
      const res = await getProfes();
      setProfes(res.data);
    };

  useEffect(() => {
    cargarClases();
    cargarProfes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      disciplina,
      dia,
      hora: hora.length === 5 ? `${hora}:00` : hora,
      nivel,
      profe_id: Number(profeId),
      cantidad_alumnas: Number(cantidadAlumnas),
    };

    if (editandoId) {
      await updateClase(editandoId, payload);
    } else {
      await createClase(payload);
    }

    limpiarFormulario();
    setModalOpen(false);
    cargarClases();
  };

  const handleEdit = (clase) => {
    setEditandoId(clase.id);
    setDisciplina(clase.disciplina);
    setDia(clase.dia);
    setHora(clase.hora);
    setNivel(clase.nivel || "");
    setProfeId(clase.profe_id);
    setCantidadAlumnas(clase.cantidad_alumnas);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteClase(id);
    cargarClases();
  };

  return (
    <div>
      <h2>Clases</h2>

    <button
            onClick={() => {
              limpiarFormulario();
              setModalOpen(true);
            }}
          >
            Crear Clase
          </button>
    
            <ul>
              {clases.map((c) => (
                <li key={c.id}>
                  {c.disciplina} – {c.dia} – {c.hora} – alumnas: {c.cantidad_alumnas}
                  <button onClick={() => handleEdit(c)}>Editar</button>
                  <button onClick={() => handleDelete(c.id)}>Eliminar</button>
                </li>
              ))}
            </ul>
    
          <Modal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              limpiarFormulario();
            }}
            title={editandoId ? "Editar Clase" : "Crear Clase"} 
          >
          <form onSubmit={handleSubmit} className="form">
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
            <div className="form-group">   
              <select
                value={dia}
                onChange={(e) => setDia(e.target.value)}
                required
              >
                <option value="">Seleccionar día</option>
                {DIA.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group"> 
              <input
                placeholder="Hora (HH:MM)"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
              />
            </div>
            <div className="form-group"> 
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                required
              >
                <option value="">Seleccionar nivel</option>
                {NIVEL.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group"> 
              <select
                value={profeId}
                onChange={(e) => setProfeId(e.target.value)}
                required
              >
                <option value="">Seleccionar profe</option>
                {profes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group"> 
              <input
                type="number"
                placeholder="Cantidad alumnas"
                value={cantidadAlumnas}
                onChange={(e) => setCantidadAlumnas(e.target.value)}
              />
            </div>
              <button type="submit">
                {editandoId ? "Guardar cambios" : "Crear clase"}
              </button>
            </form>
          </Modal>
    </div>
  );
}
