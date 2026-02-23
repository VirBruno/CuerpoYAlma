import { useEffect, useState } from "react";
import { getAbonos, createAbono, updateAbono } from "../services/abonos";
import { getAlumnas } from "../services/alumnas";
import { getClases } from "../services/clases";
import { createAsistencia } from "../services/asistencias"; 
import Modal from "../components/Modal";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 

export default function Abonos() {
  const [editandoId, setEditandoId] = useState(null);
  const [abonos, setAbonos] = useState([]);
  const [alumnas, setAlumnas] = useState([]);
  const [clases, setClases] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [alumnaId, setAlumnaId] = useState("");
  const [claseId, setClaseId] = useState("");
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [año, setAño] = useState(new Date().getFullYear());
  const [fechaPago, setFechaPago] = useState("");
  const [esRecuperacion, setEsRecuperacion] = useState(false);
  const [todoMes, setTodoMes] = useState(false);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState([]);

  const formatearFecha = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('sv-SE');
  };

  useEffect(() => {
    getAlumnas().then(res => setAlumnas(res.data));
    getAbonos().then(res => setAbonos(res.data));
    getClases().then(res => setClases(res.data));
  }, []);

  // Busca las fechas válidas de la clase en el backend
  useEffect(() => {
    if (claseId && mes && año) {
      fetch(`http://localhost:8000/clases/${claseId}/fechas?mes=${mes}&año=${año}`)
        .then(res => res.json())
        .then(data => setFechasDisponibles(data.fechas || []))
        .catch(() => setFechasDisponibles([]));
    }
  }, [claseId, mes, año]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      alumna_id: Number(alumnaId),
      clase_id: Number(claseId),
      mes: Number(mes),
      año: Number(año),
      fecha_pago: fechaPago || null,
      clases_incluidas: fechasSeleccionadas.length,
      es_recuperacion: esRecuperacion,
    };

    try {
      // 1. Crear o actualizar el abono
      let resAbono;
      if (editandoId) {
        resAbono = await updateAbono(editandoId, payload);
      } else {
        resAbono = await createAbono(payload);
      }

      // 2. Crear las asistencias individuales (Reservas)
      // Solo si es una creación nueva
      if (!editandoId) {
        const promesas = fechasSeleccionadas.map(fecha => 
          createAsistencia({
            alumna_id: Number(alumnaId),
            clase_id: Number(claseId),
            fecha: fecha,
            estado: "RESERVADA"
          })
        );
        await Promise.all(promesas);
      }

      setModalOpen(false);
      resetForm();
      getAbonos().then(res => setAbonos(res.data));
      alert("Abono y reservas creadas con éxito");
    } catch (error) {
      alert("Error: " + (error.response?.data?.detail || "No se pudo procesar"));
    }
  };

  const resetForm = () => {
    setAlumnaId("");
    setClaseId("");
    setFechasSeleccionadas([]);
    setEditandoId(null);
    setTodoMes(false);
  };

  return (
    <div>
      <h2>Abonos</h2>
      <button onClick={() => { resetForm(); setModalOpen(true); }}>Crear Nuevo Abono</button>

      {/* Renderizado de la lista... igual al tuyo */}
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Carga de Abono">
        <form onSubmit={handleSubmit} className="form">
          <select value={alumnaId} onChange={(e) => setAlumnaId(e.target.value)} required>
            <option value="">Seleccionar Alumna</option>
            {alumnas.map(a => <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>)}
          </select>

          <select value={claseId} onChange={(e) => setClaseId(e.target.value)} required>
            <option value="">Seleccionar Clase</option>
            {clases.map(c => (
              <option key={c.id} value={c.id}>
                {`${c.disciplina} - ${c.dia} ${c.hora.slice(0, 5)}hs`}
              </option>
            ))}
          </select>

          {claseId && (
            <div className="calendar-container">
              <Calendar
                // Deshabilita días que no son de esta clase
                //tileDisabled={({ date }) => !fechasDisponibles.includes(formatearFecha(date))}
                onClickDay={(date) => {
                  const f = formatearFecha(date);
                  if (!fechasDisponibles.includes(f)) return; // Evita seleccionar días inválidos
                  setFechasSeleccionadas(prev => 
                    prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
                  );
                }}
                // Agregamos una clase visual a los días seleccionados
                tileClassName={({ date }) => 
                  fechasSeleccionadas.includes(formatearFecha(date)) ? 'selected-day' : null
                }
              />
              
              <label style={{ display: 'block', marginTop: '10px' }}>
                <input 
                  type="checkbox" 
                  checked={todoMes} 
                  onChange={() => {
                    setTodoMes(!todoMes);
                    setFechasSeleccionadas(!todoMes ? [...fechasDisponibles] : []);
                  }} 
                /> Seleccionar todos los {clases.find(c => c.id == claseId)?.dia} del mes
              </label>
            </div>
          )}

          <button type="submit" className="btn-primary" //disabled={fechasSeleccionadas.length === 0 || !alumnaId}>
            >Generar Abono - {fechasSeleccionadas.length} Clases reservadas
          </button>
        </form>
      </Modal>
    </div>
  );
}