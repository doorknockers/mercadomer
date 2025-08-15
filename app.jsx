import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

// Import all components directly
const Home = window.Home;
const ProductDetail = window.ProductDetail;
const Login = window.Login;
const Register = window.Register;
const Dashboard = window.Dashboard;
const Chat = window.Chat;
const BitcoinPrice = window.BitcoinPrice;
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [params, setParams] = useState({});
  
  // Simple router implementation
  useEffect(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    
    if (path.includes('/product/')) {
      setCurrentPage('product');
      setParams({ id: path.split('/product/')[1] });
    } else if (path.includes('/login')) {
      setCurrentPage('login');
    } else if (path.includes('/register')) {
      setCurrentPage('register');
    } else if (path.includes('/dashboard')) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('home');
    }
  }, []);

  // Navigation function
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    if (path === '/') {
      setCurrentPage('home');
    } else if (path.includes('/product/')) {
      setCurrentPage('product');
      setParams({ id: path.split('/product/')[1] });
    } else if (path === '/login') {
      setCurrentPage('login');
    } else if (path === '/register') {
      setCurrentPage('register');
    } else if (path === '/dashboard') {
      setCurrentPage('dashboard');
    }
  };

  // Make components available globally
  window.Chat = Chat;
  window.BitcoinPrice = BitcoinPrice;

  const renderPage = () => {
    switch (currentPage) {
      case 'product':
        return <ProductDetail id={params.id} navigate={navigate} />;
      case 'login':
        return <Login navigate={navigate} />;
      case 'register':
        return <Register navigate={navigate} />;
      case 'dashboard':
        return <Dashboard navigate={navigate} />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
}

createRoot(document.getElementById('renderDiv')).render(<App />);