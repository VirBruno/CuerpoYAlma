import { useEffect, useState } from "react";
import client from "../api";
import "./Calendario.css";

export default function Calendario() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    client.get("/reservas").then((res) => {
      setReservas(res.data);
    });
  }, []);

  return (
    <div className="calendario">
      <h3>Reservas</h3>

      {reservas.length === 0 && <p>No hay reservas</p>}

      <ul>
        {reservas.map((r) => (
          <li key={r.id}>
            {r.fecha_clase} - Clase {r.clase_id} - {r.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
