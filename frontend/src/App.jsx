import Alumnas from "./components/Alumnas";
import Profes from "./components/Profes";
import Reservas from "./components/Reservas";
import Clases from "./components/Clases";
import Seguros from "./components/Seguros";
import Abonos from "./components/Abonos";

function App() {
  return (
    <div>
      <h1>Cuerpo y Alma</h1>
      <Alumnas />
      <Profes />
      <Clases />
      <Reservas />
      <Seguros />
      <Abonos />
    </div>
  );
}


export default App;
