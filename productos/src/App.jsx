import { ProductProvider } from './context/ProductProvider';
import FiltersPanel from './components/FiltersPanel';
import ProductList from './components/ProductList';


function App() {
  return (
    <ProductProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              🛒 Tienda de Productos
            </h1>
            <p className="text-gray-600 mt-1">
              Gestión con Context API y optimización de renders
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <FiltersPanel />
          <ProductList />
        </main>
      </div>
    </ProductProvider>
  );
}

export default App;