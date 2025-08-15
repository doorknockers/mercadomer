import React, { useState, useEffect } from 'react';

function BitcoinPrice({ priceInMxn, showFullDetails = false }) {
  const [btcData, setBtcData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    convertToBtc();
  }, [priceInMxn]);

  const convertToBtc = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://dxcyjoabcqsnpkqalqpd.supabase.co/functions/v1/bitcoin-api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_mxn: priceInMxn })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBtcData(data.data);
      } else {
        setError('Error al obtener precio BTC');
      }
    } catch (error) {
      console.error('Error converting to BTC:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${showFullDetails ? 'text-sm' : 'text-xs'} text-gray-500`}>
        🟡 Calculando precio en BTC...
      </div>
    );
  }

  if (error || !btcData) {
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
          <button
            onClick={convertToBtc}
            className="text-xs text-orange-600 hover:text-orange-700 underline"
          >
            Actualizar
          </button>
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

window.BitcoinPrice = BitcoinPrice;