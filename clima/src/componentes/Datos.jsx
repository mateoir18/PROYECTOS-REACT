// Datos.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";

export const Datos = ({ coordenadas }) => {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  async function getDatos(ruta) {
    try {
      setLoading(true);
      const response = await fetch(ruta);
      if (!response.ok) throw new Error("Error al cargar el clima");
      const data = await response.json();
      setDatos(data);
      setUltimaActualizacion(new Date());
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (coordenadas) {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coordenadas.lat}&longitude=${coordenadas.lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max&timezone=auto`;
      getDatos(url);
      // Se "activa el cronómetro": getDatos se ejecutará cada 5 min
      // setTimeout ejecuta código solo UNA vez después de X tiempo
      // setInterval → ejecuta código repetidamente cada X tiempo
      const intervalo = setInterval(() => getDatos(url), 300000);
      // Función de limpieza: "apaga el cronómetro" cuando ya no lo necesitas. Ej: Cambiar localidad
      return () => clearInterval(intervalo);
    }
  }, [coordenadas]);

  // FUNCIÓN PARA ELEGIR ICONO SEGÚN weathercode
  const getIcono = (code) => {
    if (code === 0) return "/iconos/soleado.svg";
    if (code >= 1 && code <= 3) return "/iconos/nublado.svg";
    if (code >= 45 && code <= 48) return "/iconos/niebla.svg";
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
      return "/iconos/lluvia.svg"; // ← Añadidos chubascos
    if (code >= 71 && code <= 77) return "/iconos/nieve.svg";
    if (code >= 95 && code <= 99) return "/iconos/tormenta.svg";
    return "/iconos/nublado.svg"; // fallback
  };

  if (loading && !datos)
    return <div className="clima-actual">Cargando clima...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!datos) return <div>Busca una ciudad</div>;

  const climaActual = datos.current_weather.weathercode;

  return (
    <div className="App">
      {/* CLIMA ACTUAL */}
      <div
        className="clima-actual"
        onClick={() =>
          navigate(`/dia/${datos.daily.time[0]}`, {
            state: {
              lat: coordenadas.lat,
              lon: coordenadas.lon,
              nombre: coordenadas.nombre,
            },
          })
        }
      >
        <h2>{coordenadas?.nombre || "Ciudad"}</h2>
        <img src={getIcono(climaActual)} alt="clima" className="icono-clima" />
        <div className="temperatura">{datos.current_weather.temperature}°C</div>
        <p>Viento: {datos.current_weather.windspeed} km/h</p>
      </div>

      {/* PRONÓSTICO 5 DÍAS */}
      <div className="pronostico">
        {datos.daily.time.slice(1, 6).map((dia, i) => (
          <div
            onClick={() =>
              navigate(`/dia/${datos.daily.time[i + 1]}`, {
                state: {
                  lat: coordenadas.lat,
                  lon: coordenadas.lon,
                  nombre: coordenadas.nombre,
                },
              })
            }
            key={dia}
            className="dia"
          >
            <p>
              {/* formatea la fecha según idioma/región*/}
              {new Date(dia).toLocaleDateString("es-ES", { weekday: "short" })}
            </p>
            <img src={getIcono(datos.daily.weathercode[i])} alt="icono" />
            <p className="max">{datos.daily.temperature_2m_max[i]}°</p>
            <p className="min">{datos.daily.temperature_2m_min[i]}°</p>
            <p className="lluvia">
              💧 {datos.daily.precipitation_probability_max[i + 1]}%
            </p>
          </div>
        ))}
      </div>
      <div className="ultima-actualizacion">
        {ultimaActualizacion && (
          <p>
            Ultima Actualizacion:{" "}
            {/* formatea la hora según idioma/región */}
            {ultimaActualizacion.toLocaleTimeString(`es-ES`, {
              hour: `2-digit`,
              minute: `2-digit`,
            })}
          </p>
        )}
      </div>
    </div>
  );
};
Datos.propTypes = {
  coordenadas: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    nombre: PropTypes.string,
  }),
};
