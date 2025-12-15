import { useUsuario } from "../Hooks/useUsuario";
import { useNavigate } from "react-router-dom"; // ← Añadir

export const Usuario = () => {
  //Obtenemos los datos del hook
  const { usuario, loading, error } = useUsuario();
  const navigate = useNavigate(); // ← Añadir

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner">
          <p>Cargando informacion del usuario</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error al cargar el usuario</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="usuario-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Volver
      </button>
      <div className="usuario-card">
        <h3>{usuario.name}</h3>
        <p>{usuario.email}</p>
        <p>{usuario.phone}</p>
        <p>{usuario.website}</p>
        <p>{usuario.company.name}</p>
      </div>
    </section>
  );
};
