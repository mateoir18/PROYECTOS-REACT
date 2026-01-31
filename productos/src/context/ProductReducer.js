/*
  En programación, esto se llama un Diccionario de Constantes o un Enumerado.
  Aunque parecen variables, dentro de actionTypes funcionan como propiedades de un objeto.
  Lo que realmente importa es el texto "LOAD_ERROR". React necesita ese texto para saber qué caso ejecutar en el switch del Reducer.
*/
export const actionTypes = {
  // El fetch va a empezar (activar indicador de carga)
  LOAD_START: "LOAD_START",
  // El fetch terminó con éxito (guardar productos y quitar carga)
  LOAD_SUCCESS: "LOAD_SUCCESS",
   // El fetch falló (guardar mensaje de error y quitar carga)
  LOAD_ERROR: "LOAD_ERROR",
  // El usuario cambió la categoría en el desplegable
  SET_CATEGORY: "SET_CATEGORY",
   // El usuario escribió algo en el cuadro de búsqueda
  SET_SEARCH: "SET_SEARCH",
   // El usuario movió el slider de precio mínimo
  SET_MIN_PRICE: "SET_MIN_PRICE",
   // El usuario pulsó el botón de limpiar todos los filtros
  RESET_FILTERS: "RESET_FILTERS",
};

/*
  Esta constante es el "Punto de Partida". Define exactamente cómo luce tu aplicación en el segundo 0. 
  También funcionan como propiedades de un objeto.
*/
export const initialState = {
    // Almacén principal: lista donde se guardarán los productos que lleguen de la API
  products: [],
  // Interruptor visual: indica si la aplicación está descargando datos en este momento
  loading: false,
  // Buzón de mensajes: guarda el texto del error si la conexión con el servidor falla
  error: null,
  filters: {
       // Qué grupo de productos ver (por defecto "all" para mostrar todo)
    category: "all",
       // Texto que el usuario ha escrito para buscar un producto específico
    search: "",
       // El límite de precio más bajo: no se mostrarán productos más baratos que este valor
    minPrice: 0,
  },
};

/*
  Recibe el estado actual y una orden (action), para fabricar un nuevo estado basado en esa orden.
  Imagina que el estado actual es este:
    state = { products: [A, B], loading: false, error: null }

  Cuando haces esto en el Reducer:
    return { ...state, loading: true }
    
  1. Crea un objeto nuevo { }.
  2. Lee los ... y copia: products: [A, B] y error: null.
  3. Lee el siguiente comando: loading: true. Como ya existía un loading: false que se copió antes, lo machaca y pone el nuevo valor.

  En React el estado es inmutable. Usamos los 3 puntos para:
  a) No perder los datos que no estamos tocando en ese momento.
  b) Crear un objeto nuevo para que React detecte el cambio y actualice la interfaz.
*/
export function productReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOAD_START:
      return { ...state, loading: true, error: null };

    case actionTypes.LOAD_SUCCESS:
      return { ...state, loading: false, products: action.payload };

    case actionTypes.LOAD_ERROR:
      return { ...state, loading: false, error: action.payload };

    case actionTypes.SET_CATEGORY:
      // Aquí usamos el spread dos veces: para el estado global y para el objeto de filtros
      return {
        ...state,
        filters: { ...state.filters, category: action.payload },
      };

    case actionTypes.SET_SEARCH:
      return {
        ...state,
        filters: { ...state.filters, search: action.payload },
      };

    case actionTypes.SET_MIN_PRICE:
      return {
        ...state,
        filters: { ...state.filters, minPrice: action.payload },
      };

    case actionTypes.RESET_FILTERS:
      return {
        ...state,
        filters: initialState.filters,
      };

    default:
      return state;
  }
}
