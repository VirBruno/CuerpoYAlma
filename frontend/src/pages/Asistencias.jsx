import React, { useState, useEffect } from "react";
import client from "../client";
import { getAlumnas } from "../services/alumnas";

const Asistencias = () => {
const [registros, setRegistros] = useState([]);
const [showModal, setShowModal] = useState(false);
const [step, setStep] = useState(1);
const [loading, setLoading] = useState(false);
const [alumnas, setAlumnas] = useState([]);
const [estado, setEstado] = useState("");


  const [clasesDisponibles, setClasesDisponibles] = useState([]); 
  const [claseSel, setClaseSel] = useState("");
  const [fechaSel, setFechaSel] = useState("");
  const [alumnasEncontradas, setAlumnasEncontradas] = useState([]);

    const handleEdit = (asistencia) => {
      setEditandoId(asistencia.id);
      setAlumnas(asistencia.alumna_id);
      setClaseSel(asistencia.clase_id);
      setFechaSel(asistencia.fecha_clase);
      setEstado(asistencia.estado);
  };

  // Estado para la búsqueda
  const [busquedaAlumna, setBusquedaAlumna] = useState("");

  // 2. CARGA INICIAL: Traer historial y clases
  useEffect(() => {
    cargarRegistros();
    // Traemos las clases para el select
    client.get("/clases").then(res => setClasesDisponibles(res.data));
    // Traemos las alumnas para el buscador
    getAlumnas().then(res => setAlumnas(res.data));
  }, []);

  const cargarRegistros = async () => {
    try {
      const res = await client.get("/asistencias");

      const dataMapeada = res.data.map(a => ({
        id: a.id,
        alumna: `${a.alumna?.nombre}`,
        clase: a.clase?.nombre, 
        fecha: a.fecha_clase,
        estado: a.estado
      }));
      setRegistros(dataMapeada);
    } catch (err) {
      console.error("Error cargando asistencias", err);
    }
  };

  // 3. BUSCAR ALUMNAS (Conecta con tu endpoint /asistencias/clase-dia)
const buscarReservas = async () => {
  if (!claseSel || !fechaSel) return alert("Completa clase y fecha");
  setLoading(true);
  try {
    const res = await client.get(`/asistencias/clase-dia?clase_id=${claseSel}&fecha=${fechaSel}`);
    
    // VALIDACIÓN: Si 'alumnas' no está cargado, no podemos cruzar datos
    if (!alumnas || alumnas.length === 0) {
        throw new Error("La lista general de alumnas no está cargada en el estado.");
    }

    if (res.data.length === 0) {
      alert("No hay alumnas con abono o reserva.");
      setAlumnasEncontradas([]);
    } else {
      const mapeadas = res.data.map(itemBackend => {
      const alumnaInfo = alumnas.find(al => al.id === itemBackend.alumna_id);
        
        return {
          idAlumna: itemBackend.alumna_id,
          nombre: alumnaInfo 
            ? `${alumnaInfo.nombre}` 
            : "Nombre no encontrado",
        };
      });
      setAlumnasEncontradas(mapeadas);
      setStep(2);
    }
  } catch (err) {
    console.error("Error detallado:", err); // ESTO TE DIRÁ EL ERROR REAL EN CONSOLA
    alert("Error al buscar alumnas: " + (err.response?.data?.detail || err.message));
  } finally {
    setLoading(false);
  }
};

  // 4. GUARDAR CAMBIOS (Conecta con /asistencias/actualizar-masivo)
  const finalizarPaseLista = async () => {
    const presentes = alumnasEncontradas
      .filter(a => a.checked)
      .map(a => a.idAlumna);

    try {
      await client.put("/asistencias/actualizar-masivo", {
        clase_id: parseInt(claseSel),
        fecha: fechaSel,
        alumnas_presentes: presentes
      });
      alert("Lista actualizada correctamente");
      cargarRegistros();
      resetModal();
    } catch (err) {
      alert("Error al actualizar la lista");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este registro?")) {
      try {
        await client.delete(`/asistencias/${id}`);
        cargarRegistros();
      } catch (err) {
        alert("Error al eliminar");
      }
    }
  };

  // --- Helpers ---
  const resetModal = () => {
    setShowModal(false);
    setStep(1);
    setClaseSel("");
    setFechaSel("");
    setAlumnasEncontradas([]);
  };

  const handleCheckboxChange = (index) => {
    const updated = [...alumnasEncontradas];
    updated[index].checked = !updated[index].checked;
    setAlumnasEncontradas(updated);
  };

  const registrosFiltrados = registros.filter(r => 
    r.alumna?.toLowerCase().includes(busquedaAlumna.toLowerCase())
  );

  return (
    <div className="container">
      <h2 className="titulo-seccion">Asistencias</h2>
      
      <div className="acciones-header">
        <button className="btn-primario" onClick={() => setShowModal(true)}>
          Hacer Pase de Lista
        </button>
        
        {/* Input de consulta por alumna */}
        <input 
          type="text" 
          placeholder="🔍 Consultar por alumna..." 
          className="input-busqueda"
          value={busquedaAlumna}
          onChange={(e) => setBusquedaAlumna(e.target.value)}
        />
      </div>

      <hr className="separador-horizontal" />

      <div className="historial-lista">
        <h3 className="subtitulo">
          {busquedaAlumna ? `Asistencias de: ${busquedaAlumna}` : "Historial de Registros"}
        </h3>
        
        {registrosFiltrados.map((reg) => (
          <div key={reg.id} className="tarjeta-blanca-item">
            <div className="info-principal">
              <span className="alumna-name"><strong>{reg.alumna}</strong></span>
              <span className="clase-tag">{reg.clase}</span>
              <span className="fecha-item">— {reg.fecha.split('-').reverse().join('/')}</span>
              <span className={`badge-asistencia ${reg.estado === "ASISTIÓ" ? "asistio" : "no-asistio"}`}>
                {reg.estado}
              </span>
            </div>
            
            <div className="acciones-derecha">
              <button className="btn-accion editar" onClick={() => handleEdit(reg)}>Editar</button>
              <button className="btn-accion eliminar" onClick={() => handleDelete(reg.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL EVOLUCIONADO */}
      {showModal && (
        <div className="modal-fondo-oscuro">
          <div className="modal-caja">
            <h3 className="modal-titulo">Pase de Lista</h3>
            
            {step === 1 ? (
              <div className="modal-step-1">
                <p>Selecciona la clase y fecha para cruzar abonos:</p>
                <select 
                  className="input-select" 
                  value={claseSel} 
                  onChange={e => setClaseSel(e.target.value)}
                >
                  <option value="">Seleccionar clase</option>
                  {clasesDisponibles.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.disciplina} {c.dia} {c.hora}
                    </option>
                  ))}
                </select>
                <input type="date" className="input-fecha" value={fechaSel} onChange={e => setFechaSel(e.target.value)} />
                <div className="modal-botones">
                  <button className="btn-primario" onClick={buscarReservas}>Buscar Alumnas</button>
                  <button className="btn-secundario" onClick={resetModal}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="modal-step-2">
                <p>Clase: <strong>{claseSel}</strong> | {fechaSel}</p>
                <div className="lista-check-alumnas">
                  {alumnasEncontradas.map((alum, idx) => (
                    <label key={alum.idAlumna} className="check-item">
                      <input 
                        type="checkbox" 
                        checked={alum.checked} 
                        onChange={() => handleCheckboxChange(idx)} 
                      />
                      {alum.nombre}
                    </label>
                  ))}
                </div>
                <div className="modal-botones">
                  <button className="btn-primario" onClick={finalizarPaseLista}>Cargar Lista</button>
                  <button className="btn-secundario" onClick={() => setStep(1)}>Volver</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Asistencias;