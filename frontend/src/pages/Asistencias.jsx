import React, { useState, useEffect } from "react";
import client from "../client";
import { getAlumnas } from "../services/alumnas";
import { getClases } from "../services/clases";

const Asistencias = () => {
  const [registros, setRegistros] = useState([]);
  const [alumnas, setAlumnas] = useState([]);
  const [clases, setClases] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false); // Para diferenciar Carga Masiva vs Editar Uno
  const [step, setStep] = useState(1);
  
  // Estados para formularios/filtros
  const [claseSel, setClaseSel] = useState("");
  const [fechaSel, setFechaSel] = useState("");
  const [alumnasEncontradas, setAlumnasEncontradas] = useState([]);
  const [busquedaAlumna, setBusquedaAlumna] = useState("");

  // Estado para el registro que estamos editando
  const [editForm, setEditForm] = useState({ id: null, alumna_id: "", clase_id: "", fecha: "", estado: "" });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [resAl, resCl, resAs] = await Promise.all([
      getAlumnas(),
      getClases(),
      client.get("/asistencias")
    ]);
    setAlumnas(resAl.data);
    setClases(resCl.data);
    setRegistros(resAs.data);
  };

  // --- LÓGICA DE EDICIÓN INDIVIDUAL ---
  const handleEdit = (a) => {
    setModoEdicion(true);
    setEditForm({
      id: a.id,
      alumna_id: a.alumna_id,
      clase_id: a.clase_id,
      fecha: a.fecha_clase,
      estado: a.estado
    });
    setShowModal(true);
  };

  const guardarCambiosIndividual = async () => {
    try {
      await client.patch(`/asistencias/${editForm.id}`, {
        alumna_id: Number(editForm.alumna_id),
        clase_id: Number(editForm.clase_id),
        fecha_clase: editForm.fecha,
        estado: editForm.estado
      });
      alert("Registro actualizado");
      resetModal();
      cargarDatos();
    } catch (err) {
      alert("Error al actualizar");
    }
  };

  // --- LÓGICA DE PASE MASIVO ---
  const buscarReservas = async () => {
    if (!claseSel || !fechaSel) return alert("Completa clase y fecha");
    try {
      const res = await client.get(`/asistencias/clase-dia?clase_id=${claseSel}&fecha=${fechaSel}`);
      // Aquí cruzamos con la lista de alumnas para tener los nombres en el modal
      const mapeadas = res.data.map(item => {
        const info = alumnas.find(al => al.id === item.alumna_id);
        return {
          idAlumna: item.alumna_id,
          nombre: info ? `${info.nombre} ${info.apellido || ""}` : "Desconocida",
          checked: item.estado === "ASISTIÓ"
        };
      });
      setAlumnasEncontradas(mapeadas);
      setStep(2);
    } catch (err) {
      alert("Error al buscar");
    }
  };

  const finalizarPaseLista = async () => {
    const presentes = alumnasEncontradas.filter(a => a.checked).map(a => a.idAlumna);
    await client.put("/asistencias/actualizar-masivo", {
      clase_id: parseInt(claseSel),
      fecha: fechaSel,
      alumnas_presentes: presentes
    });
    resetModal();
    cargarDatos();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar?")) {
      await client.delete(`/asistencias/${id}`);
      cargarDatos();
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setModoEdicion(false);
    setStep(1);
    setEditForm({ id: null, alumna_id: "", clase_id: "", fecha: "", estado: "" });
  };

  // Filtrado dinámico para la búsqueda
  const registrosFiltrados = registros.filter(r => {
    const alumna = alumnas.find(al => al.id === r.alumna_id);
    const nombreCompleto = alumna ? `${alumna.nombre} ${alumna.apellido}`.toLowerCase() : "";
    return nombreCompleto.includes(busquedaAlumna.toLowerCase());
  });

  return (
    <div className="container">
      <h2 className="titulo-seccion">Control de Asistencias</h2>
      
      <div className="acciones-header">
        <button className="btn-primario" onClick={() => { setModoEdicion(false); setShowModal(true); }}>
          Nuevo Pase de Lista
        </button>
        <input 
          type="text" 
          placeholder="🔍 Buscar alumna..." 
          className="input-busqueda"
          onChange={(e) => setBusquedaAlumna(e.target.value)}
        />
      </div>

      <div className="historial-lista">
        <ul>
          {registrosFiltrados.map((a) => {
            // Lógica idéntica a la de Abonos.jsx
            const alumna = alumnas.find(al => al.id === a.alumna_id);
            const clase = clases.find(c => c.id === a.clase_id);
            return (
              <li key={a.id} className="tarjeta-blanca-item">
                <div className="info-principal">
                  <strong>{alumna ? `${alumna.nombre} ${alumna.apellido || ""}` : "Alumna desconocida"}</strong>
                  <span> - {clase?.disciplina || "Sin clase"} | {a.fecha_clase}</span>
                  <span className={`badge-asistencia ${a.estado.toLowerCase()}`}> - {a.estado}</span>
                </div>
                <div className="acciones-derecha">
                  <button className="btn-accion editar" onClick={() => handleEdit(a)}>Editar</button>
                  <button className="btn-accion eliminar" onClick={() => handleDelete(a.id)}>Eliminar</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {showModal && (
        <div className="modal-fondo-oscuro">
          <div className="modal-caja">
            <h3>{modoEdicion ? "Editar Asistencia" : "Pase de Lista Masivo"}</h3>
            
            {modoEdicion ? (
              /* FORMULARIO DE EDICIÓN INDIVIDUAL */
              <div className="form-edicion">
                <label>Alumna</label>
                <select value={editForm.alumna_id} onChange={e => setEditForm({...editForm, alumna_id: e.target.value})}>
                  {alumnas.map(al => <option key={al.id} value={al.id}>{al.nombre} {al.apellido}</option>)}
                </select>

                <label>Clase</label>
                <select value={editForm.clase_id} onChange={e => setEditForm({...editForm, clase_id: e.target.value})}>
                  {clases.map(c => <option key={c.id} value={c.id}>{c.disciplina} ({c.dia})</option>)}
                </select>

                <label>Fecha</label>
                <input type="date" value={editForm.fecha} onChange={e => setEditForm({...editForm, fecha: e.target.value})} />

                <label>Estado</label>
                <select value={editForm.estado} onChange={e => setEditForm({...editForm, estado: e.target.value})}>
                  <option value="ASISTIÓ">ASISTIÓ</option>
                  <option value="FALTÓ">FALTÓ</option>
                  <option value="AVISÓ">AVISÓ</option>
                </select>

                <div className="modal-botones">
                  <button className="btn-primario" onClick={guardarCambiosIndividual}>Guardar</button>
                  <button className="btn-secundario" onClick={resetModal}>Cancelar</button>
                </div>
              </div>
            ) : (
              /* PASOS DE CARGA MASIVA */
              step === 1 ? (
                <div className="step-1">
                  <select onChange={e => setClaseSel(e.target.value)}>
                    <option value="">Seleccionar Clase</option>
                    {clases.map(c => <option key={c.id} value={c.id}>{c.disciplina} - {c.dia}</option>)}
                  </select>
                  <input type="date" onChange={e => setFechaSel(e.target.value)} />
                  <button className="btn-primario" onClick={buscarReservas}>Siguiente</button>
                  <button onClick={resetModal}>Cerrar</button>
                </div>
              ) : (
                <div className="step-2">
                  {alumnasEncontradas.map((alum, idx) => (
                    <label key={alum.idAlumna} className="check-item">
                      <input type="checkbox" checked={alum.checked} onChange={() => {
                        const copy = [...alumnasEncontradas];
                        copy[idx].checked = !copy[idx].checked;
                        setAlumnasEncontradas(copy);
                      }} /> {alum.nombre}
                    </label>
                  ))}
                  <button className="btn-primario" onClick={finalizarPaseLista}>Guardar Lista</button>
                  <button onClick={() => setStep(1)}>Volver</button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Asistencias;