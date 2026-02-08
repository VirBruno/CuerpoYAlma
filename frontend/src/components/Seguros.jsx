import { useEffect, useState } from "react";
import {
  getSeguros,
  createSeguro,
  deleteSeguro,
} from "../services/seguros";

export default function Seguros() {
  const [seguros, setSeguros] = useState([]);
  const [numero, setNumero] = useState("");
  const [fechaVigencia, setFechaVigencia] = useState("");
  const [fechaPago, setFechaPago] = useState("");

  const cargarSeguros = async () => {
    const res = await getSeguros();
    setSeguros(res.data);
  };

  useEffect(() => {
    cargarSeguros();
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  await createSeguro({
    numero: Number(numero),
    fecha_pago: fechaPago,         // ✔ snake_case
    fecha_vigencia: fechaVigencia, // ✔ snake_case
  });

  setNumero("");
  setFechaPago("");
  setFechaVigencia("");

  cargarSeguros();
};

  const handleDelete = async (id) => {
    await deleteSeguro(id);
    cargarSeguros();
  };

  return (
    <div>
      <h2>Seguros</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Número"
          type="number"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required
        />
        <input
          type="date"
          value={fechaPago}
          onChange={(e) => setFechaPago(e.target.value)}
          required
        />        
        <input
          type="date"
          value={fechaVigencia}
          onChange={(e) => setFechaVigencia(e.target.value)}
          required
        />

        <button type="submit">Crear seguro</button>
      </form>

      <ul>
        {seguros.map((a) => (
          <li key={a.id}>
            {a.numero} (Fecha Vigencia {a.fechaVigencia} - Fecha Pago {a.fechaPago})
            <button onClick={() => handleDelete(a.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
