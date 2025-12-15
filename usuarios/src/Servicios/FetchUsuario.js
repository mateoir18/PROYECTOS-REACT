export async function getUsuario(ruta) {
  const response = await fetch(ruta);
  const data = await response.json();
  return data;
}
