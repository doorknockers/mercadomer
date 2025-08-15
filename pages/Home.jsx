import React, { useState, useEffect } from 'react';

function Home({ navigate }) {
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
  const user = JSON.parse(localStorage.getItem('comprameXUser') || '{}');
  const isLoggedIn = !!user.id;

  useEffect(() => {
    fetchCategories();
    loadSampleProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const mockCategories = [
        { id: 1, name: 'Electrónicos', slug: 'electronics' },
        { id: 2, name: 'Ropa', slug: 'clothing' },
        { id: 3, name: 'Hogar', slug: 'home' },
        { id: 4, name: 'Deportes', slug: 'sports' },
        { id: 5, name: 'Vehículos', slug: 'vehicles' }
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const loadSampleProducts = () => {
    const sampleProducts = [
      {
        id: 1,
        title: 'iPhone 13 Pro Max 256GB',
        price_mxn: 18000,
        colonia: 'Roma Norte',
        city: 'Ciudad de México',
        state: 'CDMX',
        primary_image: 'https://picsum.photos/400/400?random=1',
        seller: isLoggedIn ? { nickname: 'TechSeller', id: 2 } : null
      },
      {
        id: 2,
        title: 'Bicicleta de Montaña Trek',
        price_mxn: 12500,
        colonia: 'Condesa',
        city: 'Ciudad de México', 
        state: 'CDMX',
        primary_image: 'https://picsum.photos/400/400?random=2',
        seller: isLoggedIn ? { nickname: 'BikeExpert', id: 3 } : null
      },
      {
        id: 3,
        title: 'MacBook Air M2 512GB',
        price_mxn: 28000,
        colonia: 'Polanco',
        city: 'Ciudad de México',
        state: 'CDMX', 
        primary_image: 'https://picsum.photos/400/400?random=3',
        seller: isLoggedIn ? { nickname: 'AppleFan', id: 4 } : null
      },
      {
        id: 4,
        title: 'PlayStation 5 con 2 controles',
        price_mxn: 15000,
        colonia: 'Coyoacán',
        city: 'Ciudad de México',
        state: 'CDMX',
        primary_image: 'https://picsum.photos/400/400?random=4',
        seller: isLoggedIn ? { nickname: 'GamerPro', id: 5 } : null
      },
      {
        id: 5,
        title: 'Sofa 3 plazas como nuevo',
        price_mxn: 8500,
        colonia: 'Santa Fe',
        city: 'Ciudad de México',
        state: 'CDMX',
        primary_image: 'https://picsum.photos/400/400?random=5',
        seller: isLoggedIn ? { nickname: 'HomeDecor', id: 6 } : null
      },
      {
        id: 6,
        title: 'Guitarra Fender Stratocaster',
        price_mxn: 22000,
        colonia: 'Narvarte',
        city: 'Ciudad de México',
        state: 'CDMX',
        primary_image: 'https://picsum.photos/400/400?random=6',
        seller: isLoggedIn ? { nickname: 'MusicLover', id: 7 } : null
      }
    ];
    setProducts(sampleProducts);
  };

  const searchProducts = () => {
    // Simulate search with current products
    loadSampleProducts();
  };

  const handleSearch = () => {
    searchProducts();
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setTimeout(() => searchProducts(), 300);
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
          {loading ? (
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
                  Productos Destacados ({products.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} navigate={navigate} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, isLoggedIn, navigate }) {
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
            <BitcoinPrice priceInMxn={product.price_mxn} />
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

// Simple Bitcoin Price Component
function BitcoinPrice({ priceInMxn, showFullDetails = false }) {
  const [btcData, setBtcData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock Bitcoin conversion (in real app, would call API)
    const mockConversion = () => {
      const btcRateUSD = 45000; // Mock BTC price in USD
      const usdMxnRate = 18.5; // Mock USD to MXN rate
      const btcRateMXN = btcRateUSD * usdMxnRate;
      const amountBtc = priceInMxn / btcRateMXN;
      
      setBtcData({
        amount_btc: amountBtc,
        btc_rate_usd: btcRateUSD,
        formatted_time: new Date().toLocaleString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      });
      setLoading(false);
    };

    setTimeout(mockConversion, 500);
  }, [priceInMxn]);

  if (loading) {
    return (
      <div className={`${showFullDetails ? 'text-sm' : 'text-xs'} text-gray-500`}>
        🟡 Calculando precio en BTC...
      </div>
    );
  }

  if (!btcData) {
    return (
      <div className={`${showFullDetails ? 'text-sm' : 'text-xs'} text-gray-500`}>
        🟡 No disponible en BTC
      </div>
    );
  }

  if (showFullDetails) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-orange-800">
            🟡 {btcData.amount_btc.toFixed(8)} BTC
          </span>
        </div>
        <div className="text-xs text-orange-600">
          <div>Tasa: ₿1 = ${btcData.btc_rate_usd.toLocaleString()} USD</div>
          <div className="mt-1">
            Calculado: {btcData.formatted_time}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-xs text-gray-600">
      🟡 {btcData.amount_btc.toFixed(8)} BTC
      <div className="text-xs text-gray-400 mt-1">
        {btcData.formatted_time}
      </div>
    </div>
  );
}

export default Home;
window.Home = Home;