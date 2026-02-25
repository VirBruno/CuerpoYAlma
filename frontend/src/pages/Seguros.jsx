import { useEffect, useState } from "react";
import {
  getSeguros,
  createSeguro,
  deleteSeguro,
  updateSeguro,
} from "../services/seguros";
import Modal from "../components/Modal";

export default function Seguros() {
  const [seguros, setSeguros] = useState([]);
  const [numero, setNumero] = useState("");
  const [fechaVigencia, setFechaVigencia] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const cargarSeguros = async () => {
    const res = await getSeguros();
    setSeguros(res.data);
  };

  const limpiarFormulario = () => {
    setNumero("");
    setFechaPago("");
    setFechaVigencia("");
   };

  useEffect(() => {
    cargarSeguros();
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();

    const payload = {
    numero: Number(numero),
    fecha_pago: fechaPago,        
    fecha_vigencia: fechaVigencia, 
  };

  if (editandoId) {
    await updateSeguro(editandoId, payload);
  } else {
    await createSeguro(payload);
  }

  limpiarFormulario();
  setModalOpen(false);
  cargarSeguros();
};


const handleEdit = (seguro) => {
    setEditandoId(seguro.id);
    setNumero(seguro.numero);
    setFechaPago(seguro.fecha_pago);
    setFechaVigencia(seguro.fecha_vigencia);
    setModalOpen(true);    
  };

  const handleDelete = async (id) => {
    await deleteSeguro(id);
    cargarSeguros();
  };

  return (
    <div>
      <h2>Seguros</h2>
            <button
              onClick={() => {
                limpiarFormulario();
                setModalOpen(true);
              }}
            >
              Crear Seguro
            </button>
      
      <ul>
        {seguros.map((a) => (
          <li key={a.id}>
            {a.numero} (Fecha Vigencia {a.fechaVigencia} - Fecha Pago {a.fechaPago})
            <div className="acciones-lista">
              <button onClick={() => handleEdit(a)}>Editar</button>
              <button onClick={() => handleDelete(a.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
      
            <Modal
              isOpen={modalOpen}
              onClose={() => {
                setModalOpen(false);
                limpiarFormulario();
              }}
              title={editandoId ? "Editar Seguro" : "Crear Seguro"}
            >
              <form onSubmit={handleSubmit} className="form"> 
              <div className="form-group"> 
                <input
                  placeholder="Número"
                  type="number"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  required
                />
              </div>
              <div className="form-group"> 
                <input
                  type="date"
                  value={fechaPago}
                  onChange={(e) => setFechaPago(e.target.value)}
                  required
                />   
              </div>
              <div className="form-group">                      
                <input
                  type="date"
                  value={fechaVigencia}
                  onChange={(e) => setFechaVigencia(e.target.value)}
                  required
                />
              </div>
                <button type="submit">
                  {editandoId ? "Guardar cambios" : "Crear seguro"}
                </button>

              </form>
            </Modal>
    </div>
  );
}
