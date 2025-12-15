// Buscador.jsx
import { useState } from "react";
import PropTypes from "prop-types";

export const Buscador = ({ onBuscar }) => {
  const [texto, setTexto] = useState("");

  async function getDatos(ruta) {
    try {
      const response = await fetch(ruta);

      if (!response.ok) {
        throw new Error(
          `Error HTTP: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(data);

      if (data.results && data.results.length > 0) {
        const coords = {
          lat: data.results[0].latitude,
          lon: data.results[0].longitude,
          nombre: data.results[0].name,
        };
        onBuscar(coords);
      } else {
        alert("No se encontró la localidad");
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error al buscar la localidad");
    }
  }

  function RecogerInput(e) {
    setTexto(e.target.value);
  }

  function ManejarClick() {
    if (texto.trim()) {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${texto}&count=1&language=es&format=json`;
      getDatos(url);
    }
  }

  function ManejarEnter(e) {
    if (e.key === "Enter") {
      ManejarClick();
    }
  }

  return (
    <section className="buscador">
      <input
        type="text"
        id="nuevalocalidad"
        value={texto}
        onChange={RecogerInput}
        onKeyPress={ManejarEnter}
        placeholder="Introduzca una localidad"
      />
      <button id="searchBtn" onClick={ManejarClick}>
        Buscar
      </button>
    </section>
  );
};
Buscador.propTypes = {
  onBuscar: PropTypes.func.isRequired,
};
