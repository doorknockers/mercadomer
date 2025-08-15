import React, { useState, useEffect } from 'react';

function Dashboard({ navigate }) {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const user = JSON.parse(localStorage.getItem('comprameXUser') || '{}');
  
  if (!user.id) {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    loadUserProducts();
  }, []);

  const loadUserProducts = () => {
    // Mock user products
    const mockProducts = [
      {
        id: 1,
        title: 'MacBook Pro 16" M2',
        price_mxn: 45000,
        is_active: true,
        image_count: 3,
        primary_image: 'https://picsum.photos/400/400?random=10'
      },
      {
        id: 2,
        title: 'Cámara Canon EOS R5',
        price_mxn: 32000,
        is_active: true,
        image_count: 5,
        primary_image: 'https://picsum.photos/400/400?random=11'
      }
    ];
    setProducts(mockProducts);
  };

  const tabs = [
    { id: 'products', label: 'Mis Productos', icon: '📦' },
    { id: 'stats', label: 'Estadísticas', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-white hover:text-green-200"
            >
              <span>←</span>
              <span>Inicio</span>
            </button>
            
            <h1 className="text-2xl font-bold text-white">
              Dashboard - {user.nickname}
            </h1>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + Nuevo Producto
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-green-200">Productos Activos</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <div className="text-2xl font-bold">5</div>
            <div className="text-green-200">Conversaciones</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <div className="text-2xl font-bold">2</div>
            <div className="text-green-200">Mensajes Sin Leer</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <div className="text-2xl font-bold">12</div>
            <div className="text-green-200">Mensajes Esta Semana</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'products' && (
              <ProductsTab products={products} navigate={navigate} />
            )}
            {activeTab === 'stats' && (
              <StatsTab />
            )}
          </div>
        </div>
      </div>

      {/* Create Product Modal */}
      {showCreateForm && (
        <CreateProductModal
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            loadUserProducts();
          }}
        />
      )}
    </div>
  );
}

function ProductsTab({ products, navigate }) {
  return (
    <div className="space-y-6">
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No tienes productos publicados
          </h3>
          <p className="text-gray-500">
            Crea tu primer producto para empezar a vender
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-gray-50 rounded-lg p-4 border">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img
                  src={product.primary_image}
                  alt={product.title}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                {product.title}
              </h3>
              
              <div className="text-sm text-gray-600 mb-4">
                <div className="flex justify-between items-center">
                  <span>📷 {product.image_count} foto(s)</span>
                  <span className="text-green-600">✅ Activo</span>
                </div>
                <div className="mt-2 font-bold text-green-600">
                  ${product.price_mxn.toLocaleString()} MXN
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm transition-colors"
                >
                  Ver
                </button>
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm transition-colors">
                  Editar
                </button>
                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm transition-colors">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Resumen de Actividad
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Productos activos:</span>
            <span className="font-semibold">2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total conversaciones:</span>
            <span className="font-semibold">5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mensajes sin leer:</span>
            <span className="font-semibold text-red-600">2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mensajes esta semana:</span>
            <span className="font-semibold">12</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Consejos para Vender
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Usa fotos de buena calidad</li>
          <li>• Describe bien tus productos</li>
          <li>• Responde rápido a los mensajes</li>
          <li>• Mantén precios competitivos</li>
          <li>• Acepta pagos en Bitcoin para más ventas</li>
        </ul>
      </div>
    </div>
  );
}

function CreateProductModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_mxn: '',
    category: '',
    images: ['']
  });

  const categories = [
    'Electrónicos',
    'Ropa y Accesorios',
    'Hogar y Muebles',
    'Deportes',
    'Vehículos',
    'Libros y Música',
    'Otros'
  ];

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.price_mxn) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    // Mock success
    setTimeout(() => {
      alert('¡Producto creado exitosamente!');
      onSuccess();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Crear Producto</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="iPhone 12 en excelente estado"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="Describe tu producto en detalle..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (MXN) *
              </label>
              <input
                type="number"
                value={formData.price_mxn}
                onChange={(e) => setFormData(prev => ({ ...prev, price_mxn: e.target.value }))}
                placeholder="15000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de Imagen Principal
            </label>
            <input
              type="url"
              value={formData.images[0]}
              onChange={(e) => {
                const newImages = [...formData.images];
                newImages[0] = e.target.value;
                setFormData(prev => ({ ...prev, images: newImages }));
              }}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Crear Producto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
window.Dashboard = Dashboard;