import { useEffect, useState } from "react";
import { getUsuarios } from "../Servicios/FetchUsuarios";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]); // ✅ Minúscula + array vacío inicial
  const [loading, setLoading] = useState(true); // ✅ Añadido loading
  const [error, setError] = useState(null); // ✅ Añadido error

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        setLoading(true);
        setError(null);
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (err) {
        setError(err.message);
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    }

    cargarUsuarios();
  }, []);

  // ✅ Devuelve un objeto con todo lo necesario
  return { usuarios, loading, error };
}
