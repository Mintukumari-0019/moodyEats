import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';

const Navbar = ({ setShowLogin }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalCartQuantity, token, setToken, user, setUser, search, setSearch } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    if (setUser) setUser(null);
    toast.info("Logged out successfully");
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const foodSection = document.getElementById('food-display');
        if (foodSection) foodSection.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const foodSection = document.getElementById('food-display');
      if (foodSection) foodSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cartCount = getTotalCartQuantity ? getTotalCartQuantity() : 0;

  return (
    <nav className='navbar'>
      <Link to='/' className='navbar-brand-link' onClick={() => setMobileMenuOpen(false)}>
        <h1 className='logo'>
          Moody<span>Eats</span>
        </h1>
      </Link>

      {/* Desktop Menu */}
      <ul className='navbar-menu'>
        <Link 
          to="/" 
          className={location.pathname === "/" && !location.hash ? "active" : ""}
        >
          home
        </Link>
        <span 
          className='nav-link-btn' 
          onClick={() => navigateToSection('explore-menu')}
        >
          menu
        </span>
        <span 
          className='nav-link-btn' 
          onClick={() => navigateToSection('app-download')}
        >
          mobile app
        </span>
        <Link 
          to="/contact" 
          className={location.pathname === "/contact" ? "active" : ""}
        >
          contact us
        </Link>
      </ul>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className='mobile-drawer-backdrop' onClick={() => setMobileMenuOpen(false)}>
          <div className='mobile-drawer' onClick={(e) => e.stopPropagation()}>
            <div className='mobile-drawer-header'>
              <h2 className='logo'>Moody<span>Eats</span></h2>
              <button 
                type="button" 
                className='mobile-drawer-close' 
                onClick={() => setMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className='mobile-drawer-links'>
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)} 
                className={location.pathname === "/" ? "active" : ""}
              >
                🏠 Home
              </Link>
              <span onClick={() => navigateToSection('explore-menu')}>
                🍽️ Explore Menu
              </span>
              <span onClick={() => navigateToSection('app-download')}>
                📱 Mobile App
              </span>
              <Link 
                to="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className={location.pathname === "/contact" ? "active" : ""}
              >
                📞 Contact & Support
              </Link>

              {token && (
                <>
                  <hr />
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    👤 My Profile
                  </Link>
                  <Link to="/myorders" onClick={() => setMobileMenuOpen(false)}>
                    📦 My Orders
                  </Link>
                </>
              )}
            </div>

            <div className='mobile-drawer-footer'>
              {!token ? (
                <button 
                  type="button" 
                  className='mobile-signin-btn' 
                  onClick={() => { setMobileMenuOpen(false); setShowLogin(true); }}
                >
                  Sign In / Register
                </button>
              ) : (
                <button 
                  type="button" 
                  className='mobile-logout-btn' 
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navbar Right Controls */}
      <div className="navbar-right">
        <div className="navbar-search-box">
          {showSearch ? (
            <form onSubmit={handleSearchSubmit} className="navbar-search-form">
              <input 
                type="text" 
                placeholder="Search food..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                autoFocus 
              />
              <button type="submit" className="navbar-search-submit" title="Search">
                <img src={assets.search_icon} alt="Search" />
              </button>
              <button 
                type="button" 
                className="navbar-search-close" 
                onClick={() => setShowSearch(false)}
                title="Close"
              >
                ✕
              </button>
            </form>
          ) : (
            <button 
              type="button" 
              className="navbar-search-toggle" 
              onClick={() => setShowSearch(true)}
              title="Search food"
              aria-label="Open search"
            >
              <img src={assets.search_icon} alt="Search" />
            </button>
          )}
        </div>

        <Link to='/cart' className='navbar-cart-icon' title="Cart">
          <img src={assets.basket_icon} alt="Cart" />
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>

        {!token ? (
          <button className="navbar-signin-btn" onClick={() => setShowLogin(true)}>
            Sign In
          </button>
        ) : (
          <div className='navbar-profile'>
            <div className='navbar-avatar'>
              <img src={assets.profile_icon} alt="Profile" />
              {user?.name && <span className='user-name-snippet'>{user.name.split(" ")[0]}</span>}
            </div>
            <ul className='navbar-profile-dropdown'>
              <li className='dropdown-user-greeting'>
                <b>{user?.name || "Welcome Back!"}</b>
              </li>
              <hr />
              <li onClick={() => navigate('/profile')}>
                <img src={assets.profile_icon} alt="Profile" />
                <p>My Profile</p>
              </li>
              <hr />
              <li onClick={() => navigate('/myorders')}>
                <img src={assets.bag_icon} alt="Orders" />
                <p>My Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout" />
                <p>Logout</p>
              </li> 
            </ul>
          </div>
        )}

        <button 
          className="mobile-hamburger" 
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
