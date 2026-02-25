import React, { useState, useEffect } from "react";

const Asistencias = () => {
  // 1. ESTADOS PRINCIPALES
  const [registros, setRegistros] = useState([
    { id: 1, alumna: "Vir", clase: "Pole Fijo", fecha: "2023-10-25", estado: "ASISTIÓ" },
    { id: 2, alumna: "Euge", clase: "Pole Fijo", fecha: "2023-10-25", estado: "FALTÓ" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1); // Paso 1: Filtro, Paso 2: Checkbox
  
  // Estados para el formulario del modal
  const [claseSel, setClaseSel] = useState("");
  const [fechaSel, setFechaSel] = useState("");
  const [alumnasEncontradas, setAlumnasEncontradas] = useState([]);
  
  // Estado para la búsqueda/filtro en el historial
  const [busquedaAlumna, setBusquedaAlumna] = useState("");

  // 2. SIMULACIÓN DE CRUCE DE ABONOS (Aquí es donde "traerías" de la DB)
  const buscarReservas = () => {
    if (!claseSel || !fechaSel) return alert("Completa clase y fecha");

    // Simulamos que el sistema busca quién tiene reserva para esa clase
    // En el futuro, aquí harías un fetch a tu backend
    const mockReservas = [
      { idAlumna: 101, nombre: "Vir", checked: false },
      { idAlumna: 102, nombre: "Euge", checked: false },
      { idAlumna: 103, nombre: "Andre", checked: false },
    ];
    
    setAlumnasEncontradas(mockReservas);
    setStep(2); // Pasamos a la lista de checkboxes
  };

  // 3. GUARDAR EL REGISTRO FINAL
  const finalizarPaseLista = () => {
    const nuevosRegistros = alumnasEncontradas.map(a => ({
      id: Date.now() + Math.random(),
      alumna: a.nombre,
      clase: claseSel,
      fecha: fechaSel,
      estado: a.checked ? "ASISTIÓ" : "FALTÓ"
    }));

    setRegistros([...nuevosRegistros, ...registros]);
    resetModal();
  };

  const resetModal = () => {
    setShowModal(false);
    setStep(1);
    setClaseSel("");
    setFechaSel("");
  };

  const handleCheckboxChange = (index) => {
    const updated = [...alumnasEncontradas];
    updated[index].checked = !updated[index].checked;
    setAlumnasEncontradas(updated);
  };

  // 4. FILTRO DE BÚSQUEDA POR ALUMNA
  const registrosFiltrados = registros.filter(r => 
    r.alumna.toLowerCase().includes(busquedaAlumna.toLowerCase())
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
              <button className="btn-accion editar">Editar</button>
              <button className="btn-accion eliminar">Eliminar</button>
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
                <select className="input-select" value={claseSel} onChange={e => setClaseSel(e.target.value)}>
                  <option value="">Seleccionar clase</option>
                  <option value="Pole Fijo">Pole Fijo</option>
                  <option value="Flexibilidad">Flexibilidad</option>
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