import { useEffect, useState } from "react";
import {
  getAlumnas,
  createAlumna,
  deleteAlumna,
} from "../services/alumnas";

export default function Alumnas() {
  const [alumnas, setAlumnas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [dni, setDni] = useState("");
  const [seguroId, setSeguroId] = useState("");

  const cargarAlumnas = async () => {
    const res = await getAlumnas();
    setAlumnas(res.data);
  };

  useEffect(() => {
    cargarAlumnas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createAlumna({
      nombre,
      edad: Number(edad),
      dni,
      seguro_id: Number(seguroId),
    });

    setNombre("");
    setEdad("");
    setDni("");
    setSeguroId("");

    cargarAlumnas();
  };

  const handleDelete = async (id) => {
    await deleteAlumna(id);
    cargarAlumnas();
  };

  return (
    <div>
      <h2>Alumnas</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          placeholder="Edad"
          type="number"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          required
        />
        <input
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          required
        />
        <input
          placeholder="Seguro ID"
          type="number"
          value={seguroId}
          onChange={(e) => setSeguroId(e.target.value)}
          required
        />

        <button type="submit">Crear alumna</button>
      </form>

      <ul>
        {alumnas.map((a) => (
          <li key={a.id}>
            {a.nombre} (DNI {a.dni})
            <button onClick={() => handleDelete(a.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
