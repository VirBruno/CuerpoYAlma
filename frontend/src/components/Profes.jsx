import { useEffect, useState } from "react";
import {
  getProfes,
  createProfe,
  deleteProfe,
} from "../services/profes";

export default function Profes() {
  const [profes, setProfes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [disciplina, setDisciplina] = useState("");

  const cargarProfes = async () => {
    const res = await getProfes();
    setProfes(res.data);
  };

  useEffect(() => {
    cargarProfes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createProfe({
      nombre,
      disciplina,
    });

    setNombre("");
    setDisciplina("");

    cargarProfes();
  };

  const handleDelete = async (id) => {
    await deleteProfe(id);
    cargarProfes();
  };

  return (
    <div>
      <h2>Profes</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          placeholder="Disciplina"
          value={disciplina}
          onChange={(e) => setDisciplina(e.target.value)}
          required
        />

        <button type="submit">Crear profe</button>
      </form>

      <ul>
        {profes.map((a) => (
          <li key={a.id}>
            {a.nombre} (Disciplina {a.disciplina})
            <button onClick={() => handleDelete(a.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
