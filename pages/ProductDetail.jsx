import React, { useState, useEffect } from 'react';

function ProductDetail({ id, navigate }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('comprameXUser') || '{}');
  const isLoggedIn = !!user.id;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = () => {
    // Mock product data
    const mockProduct = {
      id: parseInt(id),
      title: 'iPhone 13 Pro Max 256GB en perfectas condiciones',
      price_mxn: 18000,
      colonia: 'Roma Norte',
      city: 'Ciudad de México',
      state: 'CDMX',
      description: 'iPhone 13 Pro Max de 256GB en color azul alpino. Usado por 6 meses, en excelentes condiciones. Incluye cargador original, caja y protector de pantalla. Sin ralladuras ni golpes. Batería al 98%.',
      youtube_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      seller: isLoggedIn ? {
        id: 2,
        nickname: 'TechSeller',
        colonia: 'Roma Norte',
        city: 'Ciudad de México'
      } : null,
      product_images: [
        { image_url: 'https://picsum.photos/600/600?random=1' },
        { image_url: 'https://picsum.photos/600/600?random=2' },
        { image_url: 'https://picsum.photos/600/600?random=3' },
        { image_url: 'https://picsum.photos/600/600?random=4' }
      ]
    };
    
    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 500);
  };

  const handleContactSeller = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setShowChat(true);
  };

  const handleBitcoinPayment = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setPaymentLoading(true);
    setTimeout(() => {
      alert('🟡 Transacción Bitcoin iniciada exitosamente.\n\n' +
            'En una implementación real, aquí serías redirigido a tu wallet Bitcoin o procesador de pagos.\n\n' +
            `Cantidad: 0.00021600 BTC\n` +
            `Equivalente: $${product.price_mxn.toLocaleString()} MXN`);
      setPaymentLoading(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">Producto no encontrado</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const isOwner = isLoggedIn && user.id === product.seller?.id;

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
              <span>Volver</span>
            </button>
            
            <h1 className="text-2xl font-bold text-white">
              Compra<span className="text-orange-300">MeX</span>
            </h1>
            
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images */}
            <div className="p-6">
              <ProductImages images={product.product_images || []} title={product.title} />
            </div>

            {/* Product Info */}
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    {product.title}
                  </h1>
                  
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      ${product.price_mxn.toLocaleString()} MXN
                    </div>
                    <BitcoinPrice priceInMxn={product.price_mxn} showFullDetails={true} />
                  </div>

                  <div className="flex items-center text-gray-600 mb-4">
                    <span className="mr-2">📍</span>
                    <span>{product.colonia}, {product.city}, {product.state}</span>
                  </div>

                  {isLoggedIn && product.seller && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold text-gray-700 mb-2">Vendedor</h3>
                      <p className="text-gray-600">{product.seller.nickname}</p>
                      <p className="text-sm text-gray-500">
                        📍 {product.seller.colonia}, {product.seller.city}
                      </p>
                    </div>
                  )}
                </div>

                {isLoggedIn && product.description && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Descripción</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
                  </div>
                )}

                {isLoggedIn && product.youtube_url && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Video</h3>
                    <div className="aspect-video">
                      <iframe
                        src={product.youtube_url}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                {!isLoggedIn && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-4">🔒</div>
                    <h3 className="text-xl font-semibold text-orange-800 mb-2">
                      Contenido Completo Disponible
                    </h3>
                    <p className="text-orange-700 mb-4">
                      Inicia sesión para ver la descripción completa, todas las fotos, videos y contactar al vendedor
                    </p>
                    <div className="space-x-4">
                      <button
                        onClick={() => navigate('/login')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                      >
                        Iniciar Sesión
                      </button>
                      <button
                        onClick={() => navigate('/register')}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
                      >
                        Registrarse
                      </button>
                    </div>
                  </div>
                )}

                {isLoggedIn && !isOwner && (
                  <div className="space-y-4">
                    <button
                      onClick={handleContactSeller}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors"
                    >
                      💬 Contactar Vendedor
                    </button>
                    
                    <button
                      onClick={handleBitcoinPayment}
                      disabled={paymentLoading}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors"
                    >
                      {paymentLoading ? 'Procesando...' : '🟡 Pagar con Bitcoin'}
                    </button>
                  </div>
                )}

                {isOwner && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">👑</div>
                    <p className="text-blue-700 font-semibold">Este es tu producto</p>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Ir al Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Chat con {product.seller?.nickname}</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="h-96 p-4">
              <MockChat />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductImages({ images, title }) {
  const [currentImage, setCurrentImage] = useState(0);
  const validImages = images.filter(img => img.image_url);

  if (validImages.length === 0) {
    return (
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-400 text-6xl">📷</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={validImages[currentImage].image_url}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {validImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                currentImage === index ? 'border-green-500' : 'border-gray-200'
              }`}
            >
              <img
                src={image.image_url}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BitcoinPrice({ priceInMxn, showFullDetails = false }) {
  const [btcData, setBtcData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockConversion = () => {
      const btcRateUSD = 45000;
      const usdMxnRate = 18.5;
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

function MockChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      text: '¡Hola! Me interesa tu iPhone. ¿Está disponible?',
      sender: 'buyer',
      time: '14:32'
    },
    {
      text: 'Hola! Sí, está disponible. ¿Tienes alguna pregunta específica?',
      sender: 'seller',
      time: '14:35'
    }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages(prev => [...prev, {
        text: message,
        sender: 'buyer',
        time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.sender === 'buyer' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'buyer' ? 'text-green-100' : 'text-gray-500'
              }`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe tu mensaje..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
window.ProductDetail = ProductDetail;