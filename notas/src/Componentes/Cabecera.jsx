import { NavLink } from "react-router-dom";

export const Cabecera = () => {
  return (
    <header className="cabecera">
      <div className="cabecera-container">
        <div className="logo">
          <span className="logo-icon">📝</span>
          <h1>Mis Notas</h1>
        </div>

        <nav className="nav-menu">
          <NavLink
            to="/notas"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Todas
          </NavLink>
          <NavLink
            to="/notas/completadas"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Completadas
          </NavLink>
          <NavLink
            to="/notas/pendientes"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Pendientes
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
