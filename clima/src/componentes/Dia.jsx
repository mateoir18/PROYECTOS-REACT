import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

export const Dia = () => {
  const { fecha } = useParams();
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const { state } = useLocation();

  useEffect(() => {
    if (!state || !fecha) return; // ← Validación al inicio

    async function getDatos() {
      // ← Función dentro del useEffect
      try {
        setLoading(true);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${state.lat}&longitude=${state.lon}&hourly=temperature_2m,precipitation_probability,weathercode&start_date=${fecha}&end_date=${fecha}&timezone=auto`;
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`Error al cargar el clima del dia ${fecha}`);
        const data = await response.json();
        setDatos(data);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    getDatos();
  }, [state, fecha]); // ← Ahora sí tiene todas las dependencias

  if (loading && !datos) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!datos) return <div>Datos no disponibles</div>;

  return (
    <section className="concreto">
      <h1>
        {new Date(fecha).toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}{" "}
        - {state?.nombre || "Ciudad"}
      </h1>

      <table>
        <thead>
          <tr>
            <th>Hora</th>
            <th>Temperatura</th>
            <th>Lluvia %</th>
          </tr>
        </thead>
        <tbody>
          {/*.map() recorre cada hora y, por cada una, crea una <tr> fila*/}
          {datos.hourly.time.map((hora, i) => (
            <tr key={hora}>
              <td>{new Date(hora).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</td>
              <td>{datos.hourly.temperature_2m[i]}°C</td>
              <td>{datos.hourly.precipitation_probability[i]}%</td>
            </tr>
          ))}
          
        </tbody>
      </table>
    </section>
  );
};
