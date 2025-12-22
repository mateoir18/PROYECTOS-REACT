const API = `https://jsonplaceholder.typicode.com/todos`;

export async function getNotas() {
  const response = await fetch(API);
  const data = await response.json();
  return data;
}
