import { useProducts } from '../hooks/useProducts';

function FiltersPanel() {
  const { 
    filters, 
    categories, 
    setCategory, 
    setSearch, 
    setMinPrice, 
    resetFilters,
    filteredProducts,
    products
  } = useProducts();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Filtros</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Resetear filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar producto
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={filters.category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Precio mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio mínimo: ${filters.minPrice}
          </label>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={filters.minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredProducts.length} de {products.length} productos
      </div>
    </div>
  );
}

export default FiltersPanel;