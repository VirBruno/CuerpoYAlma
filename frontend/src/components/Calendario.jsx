import { useEffect, useState } from "react";
import client from "../api";
import "./Calendario.css";

export default function Calendario() {
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    client.get("/asistencias").then((res) => {
      setAsistencias(res.data);
    });
  }, []);

  return (
    <div className="calendario">
      <h3>Asistencias</h3>

      {asistencias.length === 0 && <p>No hay asistencias</p>}

      <ul>
        {asistencias.map((r) => (
          <li key={r.id}>
            {r.fecha_clase} - Clase {r.clase_id} - {r.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
