import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    state: '',
    city: '',
    colonia: '',
    minPrice: '',
    maxPrice: ''
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('comprameXUser') || '{}');
  const isLoggedIn = !!user.id;

  useEffect(() => {
    fetchCategories();
    searchProducts(true);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://dxcyjoabcqsnpkqalqpd.supabase.co/functions/v1/categories-api');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const searchProducts = async (reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        category: filters.category,
        state: filters.state,
        city: filters.city,
        colonia: filters.colonia,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        isLoggedIn: isLoggedIn.toString(),
        limit: limit.toString(),
        offset: (reset ? 0 : offset).toString()
      });

      const response = await fetch(
        `https://dxcyjoabcqsnpkqalqpd.supabase.co/functions/v1/products-api?${params}`
      );
      const data = await response.json();
      
      if (data.success) {
        if (reset) {
          setProducts(data.data);
          setOffset(limit);
        } else {
          setProducts(prev => [...prev, ...data.data]);
          setOffset(prev => prev + limit);
        }
        setHasMore(data.data.length === limit);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setOffset(0);
    searchProducts(true);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setOffset(0);
    setTimeout(() => searchProducts(true), 300);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      searchProducts(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-white">
                Compra<span className="text-orange-300">MeX</span>
              </h1>
              <div className="hidden md:block text-sm text-green-100">
                Tu mercadito de colonia
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-green-100">¡Hola, {user.nickname}!</span>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Mi Dashboard
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('comprameXUser');
                      window.location.reload();
                    }}
                    className="text-green-100 hover:text-white"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="text-green-100 hover:text-white px-4 py-2"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Search */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Encuentra todo en tu colonia
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Compra y vende con tus vecinos de manera segura
          </p>
          
          {/* Main Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="¿Qué buscas? Ej: iPhone 12 colonia Roma Norte"
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Buscar
                </button>
              </div>
              
              {/* Filter Toggle */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                </button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                    
                    <input
                      type="text"
                      value={filters.state}
                      onChange={(e) => handleFilterChange('state', e.target.value)}
                      placeholder="Estado"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    
                    <input
                      type="text"
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      placeholder="Ciudad"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    
                    <input
                      type="text"
                      value={filters.colonia}
                      onChange={(e) => handleFilterChange('colonia', e.target.value)}
                      placeholder="Colonia"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="Precio mín."
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="Precio máx."
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {loading && products.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Buscando productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500">
                Intenta con otros términos de búsqueda o filtros
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Resultados ({products.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} />
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {loading ? 'Cargando...' : 'Cargar más productos'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, isLoggedIn }) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border border-gray-100">
      <div onClick={() => navigate(`/product/${product.id}`)}>
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {product.primary_image ? (
            <img
              src={product.primary_image}
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
              📷
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
            {product.title}
          </h3>
          
          <div className="mb-3">
            <div className="text-2xl font-bold text-green-600 mb-1">
              ${product.price_mxn.toLocaleString()} MXN
            </div>
            <window.BitcoinPrice priceInMxn={product.price_mxn} />
          </div>
          
          <div className="text-sm text-gray-600 mb-3">
            📍 {product.colonia}, {product.city}
          </div>
          
          {isLoggedIn && product.seller && (
            <div className="text-sm text-gray-500">
              Vendedor: {product.seller.nickname}
            </div>
          )}
          
          {!isLoggedIn && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mt-3">
              <p className="text-xs text-orange-700 text-center">
                Inicia sesión para ver más detalles
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.Home = Home;