import { useState } from "react";
import { useUsuarios } from "../Hooks/useUsuarios";
import { useNavigate } from "react-router-dom";
export const Usuarios = () => {
  // 📥 Obtenemos datos del hook
  const { usuarios, loading, error } = useUsuarios();

  // 🔍 Estado para el buscador
  const [busqueda, setBusqueda] = useState("");

  // 🎯 Filtrar usuarios mientras escribe
  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  const navigate = useNavigate();

  /*
  El método filter() crea un nuevo array con todos los elementos que cumplan la condición implementada por la función dada.
  */

  // ⏳ Mostrar loading
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  // ❌ Mostrar error
  if (error) {
    return (
      <div className="error">
        <h2>Error al cargar usuarios</h2>
        <p>{error}</p>
      </div>
    );
  }

  // ✅ Mostrar lista de usuarios
  return (
    <div className="usuarios-container">
      <header>
        <h1>👥 Lista de Usuarios</h1>
        <p>Total: {usuarios.length} usuarios</p>
      </header>

      {/* 🔍 Buscador */}
      <div className="buscador">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <p className="resultados">
          {usuariosFiltrados.length} resultado(s) encontrado(s)
        </p>
      </div>

      {/* 📋 Lista de usuarios */}
      {/*  el metodo map crea un nuevo array aplicando una transformación a cada uno de los elementos del array original.*/}
      <div className="usuarios-grid">
        {usuariosFiltrados.length > 0 ? (
          usuariosFiltrados.map((usuario) => (
            <div key={usuario.id} className="usuario-card">
              <h3>{usuario.name}</h3>
              <p>📧 {usuario.email}</p>
              <p>📞 {usuario.phone}</p>
              <p>🏢 {usuario.company.name}</p>

              <button onClick={() => navigate(`/user/${usuario.id}`)}>
                Ver detalles
              </button>
            </div>
          ))
        ) : (
          <p className="no-resultados">
            No se encontraron usuarios con {busqueda}
          </p>
        )}
      </div>
    </div>
  );
};
