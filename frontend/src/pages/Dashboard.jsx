import Calendario from "../components/Calendario";
import ResumenMensual from "../components/ResumenMensual";

export default function Dashboard() {
  return (
    <>
      <h2>Dashboard mensual</h2>
      <ResumenMensual />
      <Calendario />
    </>
  );
}
