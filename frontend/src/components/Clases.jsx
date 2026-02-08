import { useEffect, useState } from "react";
import {
  getClases,
  createClase,
  updateClase,
  deleteClase,
} from "../services/clases";

export default function Clases() {
  const [clases, setClases] = useState([]);

  const [disciplina, setDisciplina] = useState("");
  const [dia, setDia] = useState("");
  const [hora, setHora] = useState("");
  const [nivel, setNivel] = useState("");
  const [profeId, setProfeId] = useState("");
  const [cantidadAlumnas, setCantidadAlumnas] = useState(0);

  const [editandoId, setEditandoId] = useState(null);

  const cargarClases = async () => {
    const res = await getClases();
    setClases(res.data);
  };

  useEffect(() => {
    cargarClases();
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

    // reset
    setEditandoId(null);
    setDisciplina("");
    setDia("");
    setHora("");
    setNivel("");
    setProfeId("");
    setCantidadAlumnas(0);

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
  };

  const handleDelete = async (id) => {
    await deleteClase(id);
    cargarClases();
  };

  return (
    <div>
      <h2>Clases</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Disciplina"
          value={disciplina}
          onChange={(e) => setDisciplina(e.target.value)}
          required
        />

        <input
          placeholder="Día"
          value={dia}
          onChange={(e) => setDia(e.target.value)}
          required
        />

        <input
          placeholder="Hora (HH:MM)"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          required
        />

        <input
          placeholder="Nivel"
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
        />

        <input
          placeholder="ID Profe"
          value={profeId}
          onChange={(e) => setProfeId(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Cantidad alumnas"
          value={cantidadAlumnas}
          onChange={(e) => setCantidadAlumnas(e.target.value)}
        />

        <button type="submit">
          {editandoId ? "Guardar cambios" : "Crear clase"}
        </button>
      </form>

      <ul>
        {clases.map((c) => (
          <li key={c.id}>
            {c.disciplina} – {c.dia} – {c.hora} – alumnas: {c.cantidad_alumnas}
            <button onClick={() => handleEdit(c)}>Editar</button>
            <button onClick={() => handleDelete(c.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
