import React, { useState, useEffect } from 'react';

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

export default BitcoinPrice;
window.BitcoinPrice = BitcoinPrice;