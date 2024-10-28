// /App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Banner from './components/Banner';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Homepage from './components/pages/homepage';
import ProductPage from './components/pages/productPage';
import ProductDetail from './components/pages/productDetail';
import Register from './components/pages/register';
import Login from './components/pages/login';
import Cart from './components/pages/cart';
import { CartProvider } from './components/context/CartContext';
import AdminRegister from './components/pages/adminRegister';
import AdminLogin from './components/pages/adminLogin';
import DashboardProvider from './components/context/DashboardContext';
import FormVisibilityProvider from './components/context/FormVisibilityContext';
import ToggleFormButton from './components/context/ToggleFormButton';
import Dashboard from './components/pages/dashboard'; 
import { LikeProvider } from './components/context/LikeContext';

const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isAdminRegister = location.pathname === '/adminRegister';
  const isAdminLogin = location.pathname === '/adminLogin';

  return (
    <>
      {!isDashboard && !isAdminRegister && !isAdminLogin && <Banner />}
      {!isDashboard && !isAdminRegister && !isAdminLogin && <Navbar />}
      <ToggleFormButton />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/productPage" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      {!isDashboard && <Footer />}
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <DashboardProvider>
        <FormVisibilityProvider>
          <LikeProvider>
            <Router>
              <div className="App">
                <AppContent />
              </div>
            </Router>
          </LikeProvider>
        </FormVisibilityProvider>
      </DashboardProvider>
    </CartProvider>
  );
}

export default App;
