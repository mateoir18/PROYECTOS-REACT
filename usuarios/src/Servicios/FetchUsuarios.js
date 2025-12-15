const API = `https://jsonplaceholder.typicode.com/users`

export async function getUsuarios(){
    const response = await fetch(API)
    const data = await response.json()
    return data;
}