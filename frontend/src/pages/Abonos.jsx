import { useEffect, useState } from "react";
import { getAbonos, createAbono, updateAbono } from "../services/abonos";
import { getAlumnas } from "../services/alumnas";
import { getClases } from "../services/clases";
import { createAsistencia } from "../services/asistencias"; 
import Modal from "../components/Modal";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// npm install date-fns
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns'; 

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
    const hoy = new Date();
    const payload = {
      alumna_id: Number(alumnaId),
      clase_id: Number(claseId),
      mes: Number(mes || hoy.getMonth() + 1), 
      año: Number(año || hoy.getFullYear()),
      fecha_pago: fechaPago || formatearFecha(hoy),
      clases_incluidas: fechasSeleccionadas.length,
      fechas_clase: fechasSeleccionadas,
      es_recuperacion: esRecuperacion,
      estado: "RESERVADA"
    };

    const handleEdit = (abono) => {
      setEditandoId(abono.id);
      setAlumnaId(abono.alumna_id);
      setClaseId(abono.clase_id);
      setMes(abono.mes);
      setAño(abono.año);
      setFechaPago(abono.fecha_pago);
      setEsRecuperacion(abono.es_recuperacion);
      setModalOpen(true);
  };

    try {
      // 1. Crear o actualizar el abono
      let resAbono;
      if (editandoId) {
        resAbono = await updateAbono(editandoId, payload);
      } else {
        resAbono = await createAbono(payload);
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

            <ul>
        {abonos.map((a) => {
          console.log("Datos del abono:", a); 
          console.log("Lista de clases actual:", clases);

          const alumna = alumnas.find(al => al.id == a.alumna_id);
          const clase = clases.find(c => c.id == a.clase_id);
          return (
          <li key={a.id}>
            {alumna?.nombre || "Alumna no encontrada"} - Clase: {clase?.disciplina || "Clase no encontrada"} - Cantidad Clases: {a.clases_incluidas}
            <div className="acciones-lista">
              <button onClick={() => handleEdit(a)}>Editar</button>
              <button onClick={() => handleDelete(a.id)}>Eliminar</button>
            </div>
          </li>
        );})}
      </ul>
      
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
              value={null} // <--- Esto evita que el círculo azul salte de un día a otro
              onClickDay={(date) => {
                const f = formatearFecha(date);
                
                // Si no hay restricciones del backend, o si la fecha está en las permitidas
                if (fechasDisponibles.length === 0 || fechasDisponibles.includes(f)) {
                  setFechasSeleccionadas(prev => 
                    prev.includes(f) 
                      ? prev.filter(x => x !== f) // Si ya estaba, la saco
                      : [...prev, f]              // Si no estaba, la agrego
                  );
                }
              }}
              tileClassName={({ date }) => {
                const f = formatearFecha(date);
                let classes = "";
                if (fechasSeleccionadas.includes(f)) classes += ' selected-day';
                if (fechasDisponibles.includes(f)) classes += ' available-day';
                return classes;
              }}
            />
              
              <label style={{ display: 'block', marginTop: '10px' }}>
                <input 
                  type="checkbox" 
                  checked={todoMes} 
                  onChange={() => {
                    if (!todoMes) {
                      // Si el backend no trajo nada, calculamos los lunes del mes actual a mano
                      if (fechasDisponibles.length === 0) {
                        const hoy = new Date();
                        const inicio = startOfMonth(hoy);
                        const fin = endOfMonth(hoy);
                        const diasDelMes = eachDayOfInterval({ start: inicio, end: fin });
                        
                        // Filtramos solo los lunes (getDay === 1)
                        const lunes = diasDelMes
                          .filter(date => getDay(date) === 1)
                          .map(date => formatearFecha(date));
                        
                        setFechasSeleccionadas(lunes);
                      } else {
                        setFechasSeleccionadas([...fechasDisponibles]);
                      }
                    } else {
                      setFechasSeleccionadas([]);
                    }
                    setTodoMes(!todoMes);
                  }}
                /> Seleccionar todos los {clases.find(c => c.id == claseId)?.dia} del mes
              </label>
            </div>
          )}
            {/* FECHA */}
            <input
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
            />
          <button type="submit" className="btn-primary" //disabled={fechasSeleccionadas.length === 0 || !alumnaId}>
            >Generar Abono - {fechasSeleccionadas.length} Clases reservadas
          </button>
        </form>
      </Modal>
    </div>
  );
}