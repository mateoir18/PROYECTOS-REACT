import React, { useState, useMemo } from "react";
import { useNotas } from "../Hooks/useNotas";


export const Notas = ({ titulo, criterioFiltro }) => {
  const { notas, loading, error, toggleNota } = useNotas();
  const [busqueda, setBusqueda] = useState("");
  const [hoverNota, setHoverNota] = useState(null);

   // useMemo memoriza el RESULTADO de una operación costosa (en este caso, filtrar un array).
  // Tiene sentido utilizarlo aquí porque:
  // 1. Rendimiento: El filtrado doble (.filter y .filter) requiere procesar el array de notas. 
  //    Si el array es grande, no queremos repetir este trabajo si no es estrictamente necesario.
  // 2. Evitar trabajo inútil: El componente se re-renderiza por cambios que no afectan a la lista, 
  //    como cuando el usuario pasa el ratón sobre una nota (hoverNota). Sin useMemo, React 
  //    filtraría todas las notas de nuevo solo por mover el ratón; con useMemo, simplemente 
  //    reutiliza el resultado guardado mientras 'notas' o 'busqueda' no cambien.
  const notasFiltradas = useMemo(() => {
    return notas
      .filter(criterioFiltro) // Primer filtro basado en una regla externa (ej: completadas/pendientes)
      .filter((n) => n.title.toLowerCase().includes(busqueda.toLowerCase())); // Segundo filtro por texto
  }, [notas, criterioFiltro, busqueda]); // Solo se ejecuta si cambia la lista, el criterio o el texto escrito


  if (loading) return <div className="spinner">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="notas-container">
      <header>
        <h1>
          {titulo} <small>({notasFiltradas.length})</small>
        </h1>
      </header>

      <input
        type="text"
        placeholder="Buscar nota..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="notas-grid">
        {notasFiltradas.length > 0 ? (
          notasFiltradas.map((nota) => (
            <div key={nota.id} className="nota-card">
              <h5>{nota.title}</h5>
              <button
                className={`nota-badge ${
                  nota.completed ? "completada" : "pendiente"
                }`}
                onClick={() => toggleNota(nota.id)}
                onMouseEnter={() => setHoverNota(nota.id)}
                onMouseLeave={() => setHoverNota(null)}
                aria-label={
                  nota.completed
                    ? "Marcar como pendiente"
                    : "Marcar como completada"
                }
              >
                {hoverNota === nota.id
                  ? nota.completed
                    ? "❌ Descompletar"
                    : "✅ Completar"
                  : nota.completed
                  ? "✅ Completada"
                  : "⏳ Pendiente"}
              </button>
            </div>
          ))
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
};
