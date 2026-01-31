import { useReducer, useMemo, useCallback, useEffect } from "react";
import { ProductContext } from "./ProductContext";
import { productReducer, initialState, actionTypes } from "./ProductReducer";
import { productService } from "../services/productService";

export function ProductProvider({ children }) {
  /*
    useReducer es un Hook de React (una herramienta integrada) que sirve para gestionar el estado de tu aplicación cuando este se vuelve complejo.

    Sirve para sustituir al useState cuando tienes muchos datos relacionados entre sí (como productos, filtros, errores y estados de carga). En lugar de tener 7 variables useState sueltas, tienes una sola gran variable (state) que lo controla todo.

    State es el nombre del estado
    dispatch es la funcion que avisa del cambio
    ProductReducer es la funcion en ProductReducer que ejecuta el cambio
    initialState es el valor por defecto del objeto state
  */
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Definir loadProducts primero para usarlo en useEffect
  const loadProducts = useCallback(async () => {
    // PASO 1: Avisamos al Reducer que inicie el estado de carga (loading: true)
    dispatch({ type: actionTypes.LOAD_START });

    try {
      // PASO 2: Intentamos traer los datos del Service.
      // Si el Service lanza un 'throw new Error', el código saltará directamente al 'catch'.
      const products = await productService.fetchProducts();

      // PASO 3: Si NO hubo fallos, enviamos los productos al Reducer
      dispatch({ type: actionTypes.LOAD_SUCCESS, payload: products });
    } catch (error) {
      // PASO 4 (RECEPCTOR DEL ERROR): Aquí recibimos el error que "lanzó" el Service.
      // 'error.message' contiene el texto: "Error al cargar productos".
      // Se lo enviamos al Reducer para que lo guarde en el 'initialState.error'.
      dispatch({ type: actionTypes.LOAD_ERROR, payload: error.message });
    }
  }, []);

  // DISPARADOR DE CARGA: Este es el "botón de encendido" automático de la aplicación.
  useEffect(() => {
    // Ejecuta la función para traer los productos de la API nada más abrir la web.
    loadProducts();

    /* 
      [loadProducts] es la dependencia: 
      - Al cargar o recargar la página, se ejecuta siempre.
      - Gracias al 'useCallback' de arriba, la función 'loadProducts' no cambia nunca 
        mientras el usuario navega o filtra, lo que evita que este efecto se dispare 
        infinitas veces y sature el servidor con peticiones repetidas.
    */
  }, [loadProducts]);

  // RECUPERAR MEMORIA: Al abrir la web, este efecto lee el "disco duro" del navegador (localStorage).
  useEffect(() => {
    const savedFilters = localStorage.getItem("productFilters");

    if (savedFilters) {
      // Convertimos el texto guardado de nuevo en un objeto JS
      const filters = JSON.parse(savedFilters);

      // Si existen filtros guardados, disparamos las órdenes al Reducer
      // para que la tienda aparezca tal como la dejó el usuario la última vez.
      if (filters.category)
        dispatch({ type: actionTypes.SET_CATEGORY, payload: filters.category });
      if (filters.search)
        dispatch({ type: actionTypes.SET_SEARCH, payload: filters.search });
      if (filters.minPrice)
        dispatch({
          type: actionTypes.SET_MIN_PRICE,
          payload: filters.minPrice,
        });
    }
    // [] asegura que esto solo ocurra una vez al cargar la página.
  }, []);

  // GUARDADO PERSISTENTE: Este efecto guarda los filtros en el "disco duro" del navegador (localStorage).
  // Los filtros se mantienen vivos en la Memoria RAM (objeto State) mientras navegues,
  // pero este efecto asegura que también se guarden fuera de React cada vez que cambian ([state.filters]).
  useEffect(() => {
    localStorage.setItem("productFilters", JSON.stringify(state.filters));
  }, [state.filters]);

  /* 
     FUNCIONES DE CONTROL (SETTERS):
     Usamos 'useCallback' con array vacío [] para que estas funciones sean "ESTABLES".
     
     ¿Qué significa esto? 
     - La IDENTIDAD de la función no cambia: Es siempre el mismo objeto en memoria RAM.
     - Esto evita que los componentes hijos (como el Panel de Filtros) se vuelvan a 
       dibujar innecesariamente, mejorando el rendimiento de la App.
     
     ¿Y el valor (parámetro)? 
     - Aunque la función sea la misma, el VALOR que recibe (category, search, price) 
       SÍ cambia según lo que el usuario haga. El 'useCallback' congela el "molde" 
       de la función, pero permite que le pasemos "ingredientes" distintos cada vez.
  */

  const setCategory = useCallback((category) => {
    // Aunque 'setCategory' es siempre la misma función, el 'payload' será
    // lo que el usuario elija en el desplegable en ese momento.
    dispatch({ type: actionTypes.SET_CATEGORY, payload: category });
  }, []);

  const setSearch = useCallback((search) => {
    dispatch({ type: actionTypes.SET_SEARCH, payload: search });
  }, []);

  const setMinPrice = useCallback((price) => {
    dispatch({ type: actionTypes.SET_MIN_PRICE, payload: price });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: actionTypes.RESET_FILTERS });
  }, []);

  // OPTIMIZACIÓN DE CATEGORÍAS:
  // 'useMemo' memoriza la lista de categorías únicas.
  // Evita que React recorra todos los productos cada vez que la página se actualiza (re-render).
  // Solo se vuelve a calcular si la lista de productos original cambia ([state.products]).
  const categories = useMemo(() => {
    // 1. Extraemos todas las categorías, borramos duplicados con 'Set' y creamos un array.
    const uniqueCategories = [
      ...new Set(state.products.map((p) => p.category)),
    ];
    // 2. Las devolvemos ordenadas alfabéticamente para el menú desplegable.
    // Es necesario usar el return porque useMemo es una función que fabrica un valor. Si no retornas nada, la constante categories quedaría como undefined
    return uniqueCategories.sort();

    // Solo se recalcula si la lista original de productos cambia.
    // Si el usuario solo filtra o busca, React usa la versión memorizada.
  }, [state.products]);

  // OPTIMIZACIÓN DE FILTRADO (El corazón de la búsqueda):
  // 'useMemo' guarda en memoria el resultado de filtrar los productos.
  // Es fundamental porque el filtrado es una operación costosa.
  // React solo repite el filtro si el usuario toca los filtros o si llegan productos nuevos.
  const filteredProducts = useMemo(() => {
    return state.products.filter((product) => {
      // 1. Filtro de Categoría:
      // Si la categoría es "all", pasan todos. Si no, solo los que coincidan exactamente.
      const matchCategory =
        state.filters.category === "all" ||
        product.category === state.filters.category;

      // 2. Filtro de Precio:
      // Solo pasan los productos cuyo precio sea igual o mayor al mínimo elegido.
      const matchPrice = product.price >= state.filters.minPrice;

      // 3. Filtro de Búsqueda (Texto):
      // Si no hay texto, pasan todos. Si hay, buscamos si el título del producto
      // contiene ese texto (sin importar mayúsculas/minúsculas).
      const matchSearch =
        state.filters.search === "" ||
        product.title
          .toLowerCase()
          .includes(state.filters.search.toLowerCase());

      // REGLA FINAL: Un producto solo aparece si cumple las TRES condiciones a la vez.
      return matchCategory && matchPrice && matchSearch;
    });
    // Se vuelve a calcular solo si cambian los productos originales o los filtros del usuario.
  }, [state.products, state.filters]);

  // Memoizar el value del context para evitar re-renders
  const value = useMemo(
    () => ({
      ...state,
      filteredProducts,
      categories,
      setCategory,
      setSearch,
      setMinPrice,
      resetFilters,
      loadProducts,
    }),
    [
      state,
      filteredProducts,
      categories,
      setCategory,
      setSearch,
      setMinPrice,
      resetFilters,
      loadProducts,
    ]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
