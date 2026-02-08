import { useEffect, useState } from "react";
import {
  getAlumnas,
  createAlumna,
  deleteAlumna,
  updateAlumna,
} from "../services/alumnas";
import { getSeguros } from "../services/seguros";

export default function Alumnas() {
  const [alumnas, setAlumnas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [dni, setDni] = useState("");
  const [seguroId, setSeguroId] = useState("");
  const [seguros, setSeguros] = useState([]);

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

    setNombre("");
    setEdad("");
    setDni("");
    setSeguroId("");

    cargarAlumnas();
  };

    const handleEdit = (alumna) => {
    setEditandoId(alumna.id);
    setNombre(alumna.nombre);
    setEdad(alumna.edad);
    setSeguroId(alumna.seguro_id);
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
        <select
          value={seguroId}
          onChange={(e) => setSeguroId(e.target.value)}
          required
        >
          <option value="">Seleccionar seguro</option>
          {seguros.map((a) => (
            <option key={a.id} value={a.id}>
              {a.numero}
            </option>
          ))}
        </select>

      <button type="submit">
        {editandoId ? "Guardar cambios" : "Crear alumna"}
      </button>
      </form>

      <ul>
        {alumnas.map((a) => (
          <li key={a.id}>
            {a.nombre} (DNI {a.dni})
            <button onClick={() => handleEdit(a)}>Editar</button>
            <button onClick={() => handleDelete(a.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
