import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import Alumnas from "./pages/Alumnas";
import Profes from "./pages/Profes";
import Clases from "./pages/Clases";
import Asistencias from "./pages/Asistencias";
import Seguros from "./pages/Seguros";
import Abonos from "./pages/Abonos";

function App() {
  return (
    <div className="app-container">
      <h1>Cuerpo y Alma</h1>

      <nav>
        <Link to="/">Dashboard</Link> |{" "}
        <Link to="/alumnas">Alumnas</Link> |{" "}
        <Link to="/profes">Profes</Link> |{" "}
        <Link to="/clases">Clases</Link> |{" "}
        <Link to="/asistencias">Asistencias</Link> |{" "}
        <Link to="/seguros">Seguros</Link> |{" "}
        <Link to="/abonos">Abonos</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alumnas" element={<Alumnas />} />
        <Route path="/profes" element={<Profes />} />
        <Route path="/clases" element={<Clases />} />
        <Route path="/asistencias" element={<Asistencias />} />
        <Route path="/seguros" element={<Seguros />} />
        <Route path="/abonos" element={<Abonos />} />
      </Routes>
    </div>
  );
}

export default App;
