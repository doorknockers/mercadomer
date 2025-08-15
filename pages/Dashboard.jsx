import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('comprameXUser') || '{}');
  
  if (!user.id) {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, conversationsRes, statsRes] = await Promise.all([
        fetch(`https://dxcyjoabcqsnpkqalqpd.supabase.co/functions/v1/seller-dashboard-api/products?sellerId=${user.id}`),
        fetch(`https://dxcyjoabcqsnpkqalqpd.supabase.co/functions/v1/seller-dashboard-api/conversations?sellerId=${user.id}`),
        fetch(`https://dxcyjoabcqsnpkqalqpd.supabase.co/functions/v1/seller-dashboard-api/stats?sellerId=${user.id}`)
      ]);

      const [productsData, conversationsData, statsData] = await Promise.all([
        productsRes.json(),
        conversationsRes.json(),
        statsRes.json()
      ]);

      if (productsData.success) setProducts(productsData.data);
      if (conversationsData.success) setConversations(conversationsData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'products', label: 'Mis Productos', icon: '📦' },
    { id: 'conversations', label: 'Conversaciones', icon: '💬' },
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
            <div className="text-2xl font-bold">{stats.total_active_products || 0}</div>
            <div className="text-green-200">Productos Activos</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <div className="text-2xl font-bold">{stats.total_conversations || 0}</div>
            <div className="text-green-200">Conversaciones</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <div className="text-2xl font-bold">{stats.unread_messages || 0}</div>
            <div className="text-green-200">Mensajes Sin Leer</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <div className="text-2xl font-bold">{stats.recent_messages_7_days || 0}</div>
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
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando...</p>
              </div>
            ) : (
              <>
                {activeTab === 'products' && (
                  <ProductsTab 
                    products={products} 
                    onRefresh={fetchDashboardData}
                    userId={user.id}
                  />
                )}
                {activeTab === 'conversations' && (
                  <ConversationsTab 
                    conversations={conversations}
                    currentUserId={user.id}
                  />
                )}
                {activeTab === 'stats' && (
                  <StatsTab stats={stats} />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Create Product Modal */}
      {showCreateForm && (
        <CreateProductModal
          userId={user.id}
          userLocation={{ colonia: user.colonia, city: user.city, state: user.state }}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
}

function ProductsTab({ products, onRefresh, userId }) {
  const [editingProduct, setEditingProduct] = useState(null);

  const handleDelete = async (productId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      const response = await fetch(`https://dxcyjoabcqsnpkqalqpd.supabase.co/functions/v1/products-api/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller_id: userId })
      });
      
      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

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
                {product.primary_image ? (
                  <img
                    src={product.primary_image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                    📷
                  </div>
                )}
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                {product.title}
              </h3>
              
              <div className="text-sm text-gray-600 mb-4">
                <div>📷 {product.image_count} foto(s)</div>
                <div className={`mt-1 ${product.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {product.is_active ? '✅ Activo' : '❌ Inactivo'}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          userId={userId}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function ConversationsTab({ conversations, currentUserId }) {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="space-y-6">
      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No tienes conversaciones
          </h3>
          <p className="text-gray-500">
            Las conversaciones aparecerán cuando alguien contacte sobre tus productos
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              className="bg-gray-50 rounded-lg p-4 border cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">
                  {conversation.buyer.nickname}
                </h3>
                {conversation.unread_count > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {conversation.unread_count}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                Producto: {conversation.product.title}
              </p>
              
              {conversation.latest_message && (
                <p className="text-sm text-gray-500 line-clamp-2">
                  "{conversation.latest_message.content}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedConversation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                Chat con {selectedConversation.buyer.nickname}
              </h3>
              <button
                onClick={() => setSelectedConversation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="h-96">
              <window.Chat 
                conversationId={selectedConversation.id} 
                currentUserId={currentUserId} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatsTab({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Resumen de Actividad
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Productos activos:</span>
            <span className="font-semibold">{stats.total_active_products || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total conversaciones:</span>
            <span className="font-semibold">{stats.total_conversations || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mensajes sin leer:</span>
            <span className="font-semibold text-red-600">{stats.unread_messages || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mensajes esta semana:</span>
            <span className="font-semibold">{stats.recent_messages_7_days || 0}</span>
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

function CreateProductModal({ userId, userLocation, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_mxn: '',
    youtube_url: '',
    category_id: '',
    images: []
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
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

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.price_mxn) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://dxcyjoabcqsnpkqalqpd.supabase.co/functions/v1/products-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seller_id: userId,
          category_id: formData.category_id || null,
          title: formData.title,
          description: formData.description,
          price_mxn: parseFloat(formData.price_mxn),
          colonia: userLocation.colonia,
          city: userLocation.city,
          state: userLocation.state,
          youtube_url: formData.youtube_url || null,
          images: formData.images
        })
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
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
                value={formData.category_id}
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube URL (opcional)
            </label>
            <input
              type="url"
              value={formData.youtube_url}
              onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URLs de Imágenes (máximo 5)
            </label>
            {[0, 1, 2, 3, 4].map(index => (
              <input
                key={index}
                type="url"
                value={formData.images[index] || ''}
                onChange={(e) => {
                  const newImages = [...formData.images];
                  newImages[index] = e.target.value;
                  setFormData(prev => ({ ...prev, images: newImages.filter(Boolean) }));
                }}
                placeholder={`URL de imagen ${index + 1}${index === 0 ? ' (principal)' : ''}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
              />
            ))}
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
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditProductModal({ product, userId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description || '',
    price_mxn: product.price_mxn.toString()
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.price_mxn) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://dxcyjoabcqsnpkqalqpd.supabase.co/functions/v1/products-api/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seller_id: userId,
          title: formData.title,
          description: formData.description,
          price_mxn: parseFloat(formData.price_mxn)
        })
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Editar Producto</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio (MXN) *
            </label>
            <input
              type="number"
              value={formData.price_mxn}
              onChange={(e) => setFormData(prev => ({ ...prev, price_mxn: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;