import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Cabecera } from "./Componentes/Cabecera";
import { Notas } from "./Componentes/Notas";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Cabecera />
      <Routes>
        <Route
          path="/notas"
          element={
            <Notas titulo="Todas las Notas" criterioFiltro={() => true} />
          }
        />
        <Route
          path="/notas/completadas"
          element={
            <Notas
              titulo="Notas Completadas"
              criterioFiltro={(n) => n.completed === true}
            />
          }
        />
        <Route
          path="/notas/pendientes"
          element={
            <Notas
              titulo="Notas Pendientes"
              criterioFiltro={(n) => n.completed === false}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
