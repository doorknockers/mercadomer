import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [basename, setBasename] = useState('');

  useEffect(() => {
    const path = window.location.pathname;
    const basePath = path.substring(0, path.lastIndexOf('/'));
    setBasename(basePath);

    const checkDependencies = () => {
      if (
        window.Home &&
        window.ProductDetail &&
        window.Login &&
        window.Register &&
        window.Dashboard &&
        window.Chat
      ) {
        setIsReady(true);
      }
    };

    checkDependencies();
    const interval = setInterval(checkDependencies, 100);
    return () => clearInterval(interval);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Compra<span className="text-orange-300">MeX</span>
        </h1>
        <p className="text-green-200">Cargando tu mercadito de colonia...</p>
      </div>
    );
  }

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<window.Home />} />
        <Route path="/product/:id" element={<window.ProductDetail />} />
        <Route path="/login" element={<window.Login />} />
        <Route path="/register" element={<window.Register />} />
        <Route path="/dashboard" element={<window.Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('renderDiv')).render(<App />);