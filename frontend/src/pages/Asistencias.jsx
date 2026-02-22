import { useEffect, useState } from "react";
import { getClases } from "../services/clases";
import api from "../api";

export default function Asistencia() {
  const [clases, setClases] = useState([]);
  const [claseId, setClaseId] = useState("");
  const [fecha, setFecha] = useState("");
  const [lista, setLista] = useState([]);
  const [presentes, setPresentes] = useState([]);

  useEffect(() => {
    const cargarClases = async () => {
      const res = await getClases();
      setClases(res.data);
    };
    cargarClases();
  }, []);

  // 🔹 Traer lista del backend
  const cargarLista = async () => {
    if (!claseId || !fecha) return;

    const res = await api.get("/asistencias/clase", {
      params: { clase_id: claseId, fecha },
    });

    setLista(res.data);

    // Pre-marcar las que ya están como ASISTIO
    const yaPresentes = res.data
      .filter((a) => a.estado === "ASISTIO")
      .map((a) => a.alumna_id);

    setPresentes(yaPresentes);
  };

  // 🔹 Toggle checkbox
  const togglePresente = (alumnaId) => {
    if (presentes.includes(alumnaId)) {
      setPresentes(presentes.filter((id) => id !== alumnaId));
    } else {
      setPresentes([...presentes, alumnaId]);
    }
  };

  // 🔹 Enviar al backend
  const guardarLista = async () => {
    await api.put("/asistencias/actualizar-masivo", {
      clase_id: Number(claseId),
      fecha,
      alumnas_presentes: presentes,
    });

    alert("Lista guardada correctamente");
  };

  return (
    <div>
      <h2>Pase de Lista</h2>

      {/* CLASE */}
      <select
        value={claseId}
        onChange={(e) => setClaseId(e.target.value)}
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
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <button onClick={cargarLista}>
        Cargar Lista
      </button>

      <hr />

      {/* LISTA DE ALUMNAS */}
      {lista.length > 0 && (
        <>
          <h3>Alumnas</h3>

          {lista.map((a) => (
            <div key={a.alumna_id}>
              <label>
                <input
                  type="checkbox"
                  checked={presentes.includes(a.alumna_id)}
                  onChange={() => togglePresente(a.alumna_id)}
                />
                {a.nombre}
              </label>
            </div>
          ))}

          <button onClick={guardarLista}>
            Guardar Asistencias
          </button>
        </>
      )}
    </div>
  );
}