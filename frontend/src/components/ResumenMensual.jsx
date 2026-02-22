import { useEffect, useState } from "react";
import client from "../api"; // ajustá si tu api está en otra carpeta
import "./ResumenMensual.css";

export default function ResumenMensual() {
  const [resumen, setResumen] = useState(null);

  const hoy = new Date();
  const mes = hoy.getMonth() + 1;
  const año = hoy.getFullYear();

  useEffect(() => {
    client
      .get(`/resumen-mensual?mes=${mes}&año=${año}`)
      .then((res) => setResumen(res.data))
      .catch(() => setResumen(null));
  }, []);

  if (!resumen) return <p>Cargando resumen...</p>;

  return (
    <div className="resumen-container">
      <div className="card">
        <h3>Alumnas activas</h3>
        <p>{resumen.alumnas_activas}</p>
      </div>

      <div className="card">
        <h3>Reservas del mes</h3>
        <p>{resumen.asistencias_totales}</p>
      </div>

      <div className="card">
        <h3>Clases usadas</h3>
        <p>{resumen.clases_usadas}</p>
      </div>
    </div>
  );
}
