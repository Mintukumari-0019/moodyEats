import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className='admin-navbar'>
      <div className='navbar-left'>
        <Link to='/dashboard' className='admin-logo-wrapper'>
          <span className='admin-logo-icon'>🍔</span>
          <h1 className='admin-logo'>
            Moody<span>Eats</span>
          </h1>
        </Link>
        <span className='admin-badge'>Console</span>
        
        <div className='system-health-pill' title="Backend API connected and active">
          <span className='live-pulse-dot'></span>
          <span>System Online</span>
        </div>
      </div>

      <div className='navbar-right'>
        <div className='admin-meta-time' title="Current System Time">
          <span>🕒 {currentTime || "Live"}</span>
        </div>

        <a 
          href='http://localhost:5173/' 
          target='_blank' 
          rel='noopener noreferrer'
          className='view-store-btn'
          title='Open Live Customer Store'
        >
          <span>View Store</span>
          <span className='external-icon'>↗</span>
        </a>

        <div className='admin-user-capsule'>
          <img className='admin-profile-img' src={assets.profile_image} alt="Admin Profile" />
          <div className='admin-user-details'>
            <span className='admin-name'>Administrator</span>
            <span className='admin-role'>Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
