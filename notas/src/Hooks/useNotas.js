import { useEffect, useState, useCallback } from "react";
import { getNotas } from "../Servicios/FetchNotas";

export function useNotas() {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarNotas() {
      try {
        setLoading(true);
        setError(null);
        const data = await getNotas();
        setNotas(data);
      } catch (err) {
        setError(err.message);
        setNotas([]);
      } finally {
        setLoading(false);
      }
    }
    cargarNotas();
  }, []);

   // useCallback memoriza la función para evitar que se recree en cada renderizado del componente.
  // Tiene sentido aquí porque:
  // 1. Estabilidad: Al no cambiar su identidad, si esta función se pasara como prop a componentes 
  //    hijos optimizados (con React.memo), evitaría que esos hijos se re-rendericen sin necesidad.
  // 2. Independencia: Gracias al uso de 'setNotas((prevNotas) => ...)', la función no depende 
  //    del valor actual de 'notas', permitiendo que el array de dependencias esté vacío [] 
  //    y la función sea creada exactamente una sola vez en todo el ciclo de vida.
  const toggleNota = useCallback((id) => {
    setNotas((prevNotas) =>
      prevNotas.map((nota) =>
        // Si el ID coincide, creamos un nuevo objeto con el estado 'completed' invertido
        nota.id === id ? { ...nota, completed: !nota.completed } : nota
      )
    );
  }, []);


  return { notas, loading, error, toggleNota };
}
