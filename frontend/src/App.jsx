import React, { useState, useEffect } from 'react';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes, Navigate } from 'react-router-dom';
import Cart from './pages/Cart/Cart';
import LoginPopup from './components/LoginPopup/LoginPopup';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import MyOrders from './pages/MyOrders/MyOrders';
import Contact from './pages/Contact/Contact';
import Profile from './pages/Profile/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify/Verify';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/profile' element={<Profile setShowLogin={setShowLogin} />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />

      {showBackToTop && (
        <button 
          className="back-to-top-btn" 
          onClick={scrollToTop} 
          title="Back to top"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default App;
