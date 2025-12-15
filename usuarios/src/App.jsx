import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Usuarios } from "./Componentes/Usuarios";
import { Usuario } from "./Componentes/Usuario";
import './App.css'; // ← Añadir esta línea

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Usuarios/>}></Route>
          <Route path="/user/:id" element={<Usuario/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
