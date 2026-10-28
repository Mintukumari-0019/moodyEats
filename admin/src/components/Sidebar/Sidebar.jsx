import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className='admin-sidebar'>
      <div className="sidebar-content">
        <div className="sidebar-group">
          <span className="sidebar-section-title">MAIN NAVIGATION</span>
          <div className="sidebar-options">
            <NavLink to='/dashboard' className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
              <div className="sidebar-icon-wrapper">
                <span className="sidebar-icon">📊</span>
              </div>
              <div className="sidebar-text-col">
                <p className="sidebar-title">Dashboard</p>
                <span className="sidebar-subtitle">Analytics & Overview</span>
              </div>
            </NavLink>

            <NavLink to='/orders' className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
              <div className="sidebar-icon-wrapper">
                <span className="sidebar-icon">📦</span>
              </div>
              <div className="sidebar-text-col">
                <p className="sidebar-title">Orders</p>
                <span className="sidebar-subtitle">Live Kitchen Tracker</span>
              </div>
            </NavLink>

            <NavLink to='/list' className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
              <div className="sidebar-icon-wrapper">
                <span className="sidebar-icon">📋</span>
              </div>
              <div className="sidebar-text-col">
                <p className="sidebar-title">Food Menu</p>
                <span className="sidebar-subtitle">Edit & Manage Dishes</span>
              </div>
            </NavLink>

            <NavLink to='/add' className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
              <div className="sidebar-icon-wrapper">
                <span className="sidebar-icon">➕</span>
              </div>
              <div className="sidebar-text-col">
                <p className="sidebar-title">Add Food</p>
                <span className="sidebar-subtitle">New Dish Listing</span>
              </div>
            </NavLink>
          </div>
        </div>

        <div className="sidebar-group">
          <span className="sidebar-section-title">QUICK LINKS</span>
          <div className="sidebar-options">
            <a 
              href="http://localhost:5173/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="sidebar-option store-link"
            >
              <div className="sidebar-icon-wrapper">
                <span className="sidebar-icon">🌐</span>
              </div>
              <div className="sidebar-text-col">
                <p className="sidebar-title">Customer Store</p>
                <span className="sidebar-subtitle">Open in New Tab ↗</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="sidebar-footer-widget">
        <div className="store-status-row">
          <div className="admin-status-dot"></div>
          <div className="status-text-block">
            <span className="store-live-title">MoodyEats Service</span>
            <span className="store-live-sub">Accepting Orders</span>
          </div>
        </div>
        <span className="system-version-tag">MoodyEats v2.4</span>
      </div>
    </aside>
  );
};

export default Sidebar;
