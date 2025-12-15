// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Buscador } from "./componentes/Buscador";
import { Datos } from "./componentes/datos";
import { Dia } from "./componentes/Dia";
import "./App.css";

function App() {
  const [coordenadas, setCoordenadas] = useState({
    lat: 40.4168,
    lon: -3.7038,
    nombre: "Madrid",
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Buscador onBuscar={setCoordenadas} />
              <Datos coordenadas={coordenadas} />
            </>
          }
        />
        <Route path="/dia/:fecha" element={<Dia />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
/* 
  PARA PASAR DATOS ENTRE COMPONENTES:
  
  - MISMA RUTA (misma página): 
    → PROPS
  
  - DISTINTAS RUTAS (navegación entre páginas):
    → LOCATION STATE (navigate con state)
    → URL PARAMS (useParams para leer datos de la URL)
*/
