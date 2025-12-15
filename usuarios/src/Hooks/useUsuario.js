import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUsuario } from "../Servicios/FetchUsuario";

export function useUsuario() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 

  useEffect(() => {
    const API = `https://jsonplaceholder.typicode.com/users/${id}`;
    async function cargarUsuario() {
      try {
        setLoading(true);
        setError(null);
        const data = await getUsuario(API);
        setUsuario(data);
      } catch (error) {
        setError(error.message);
        setUsuario(null); //Esto creo que se puede quitar porque si entra en el catch significa que no ha entrado en el try con lo cual usuario que está inicializado en null, nunca ha dejado de ser null no? -> en teoria si, pero es mejor dejarlo por seguridad y claridad.
      } finally {
        setLoading(false);
      }
    }
    cargarUsuario() //¿Por que llamas a la funcion dentro del useEffect -> useEffect espera que le devuelvas undefined o una función de limpieza pero nunca una promesa
  }, [id]); // no se si esto es correcto, La intencion es que se renderize cuando cambie el id del usuario en cuestion -> Es correcto, se re-ejecuta

  return {usuario, loading, error}
}
