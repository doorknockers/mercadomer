import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('comprameXUser') || '{}');
  const isLoggedIn = !!user.id;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `https://dxcyjoabcqsnpkqalqpd.supabase.co/functions/v1/products-api/${id}?isLoggedIn=${isLoggedIn}`
      );
      const data = await response.json();
      if (data.success) {
        setProduct(data.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('https://dxcyjoabcqsnpkqalqpd.supabase.co/functions/v1/conversations-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          buyer_id: user.id,
          seller_id: product.seller.id
        })
      });
      const data = await response.json();
      if (data.success) {
        setConversationId(data.data.id);
        setShowChat(true);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleBitcoinPayment = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setPaymentLoading(true);
    try {
      // First convert to BTC
      const convertResponse = await fetch('https://dxcyjoabcqsnpkqalqpd.supabase.co/functions/v1/bitcoin-api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_mxn: product.price_mxn })
      });
      const convertData = await convertResponse.json();
      
      if (convertData.success) {
        // Create transaction record
        const transactionResponse = await fetch('https://dxcyjoabcqsnpkqalqpd.supabase.co/functions/v1/bitcoin-api/transaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: product.id,
            buyer_id: user.id,
            seller_id: product.seller.id,
            amount_mxn: product.price_mxn,
            amount_btc: convertData.data.amount_btc,
            btc_rate: convertData.data.btc_rate_usd
          })
        });
        const transactionData = await transactionResponse.json();
        
        if (transactionData.success) {
          alert('🟡 Transacción Bitcoin iniciada exitosamente.\n\n' +
                'En una implementación real, aquí serías redirigido a tu wallet Bitcoin o procesador de pagos.\n\n' +
                `Cantidad: ${convertData.data.amount_btc.toFixed(8)} BTC\n` +
                `Equivalente: $${product.price_mxn.toLocaleString()} MXN`);
        }
      }
    } catch (error) {
      console.error('Error processing Bitcoin payment:', error);
      alert('Error al procesar el pago con Bitcoin. Por favor intenta de nuevo.');
    } finally {
      setPaymentLoading(false);
    }
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
                    <window.BitcoinPrice priceInMxn={product.price_mxn} showFullDetails={true} />
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
                        src={product.youtube_url.replace('watch?v=', 'embed/')}
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
      {showChat && conversationId && (
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
            <div className="h-96">
              <window.Chat conversationId={conversationId} currentUserId={user.id} />
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
          onError={(e) => {
            e.target.src = '';
            e.target.style.display = 'none';
          }}
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
                onError={(e) => {
                  e.target.src = '';
                  e.target.style.display = 'none';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

window.ProductDetail = ProductDetail;