export const productService = {
  async fetchProducts() {
    // PASO 1: Se intenta la conexión con el servidor
    const response = await fetch('https://fakestoreapi.com/products');
     // ORIGEN DEL ERROR: Aquí se "fabrica" el mensaje. 
      // Este 'throw' detiene la función y lanza el mensaje hacia ProductProvider.js
    if (!response.ok) throw new Error('Error al cargar productos');
    return response.json();
  }
};