import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");
  const [showSearch, setShowSearch] = useState(false);
  const { getTotalCartAmount, token, setToken, search, setSearch } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/');
  }

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const foodSection = document.getElementById('food-display');
        if (foodSection) foodSection.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const foodSection = document.getElementById('food-display');
      if (foodSection) foodSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className='navbar'>
      <Link to='/' onClick={() => setMenu("home")}>
        <h1 className='logo'><b>GOFOOD</b></h1>
      </Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>menu</a>
        <a href='#app-download' onClick={() => setMenu("mob-app")} className={`${menu === "mob-app" ? "active" : ""}`}>mobile app</a>
        <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>contact us</a>
      </ul>
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
                title="Close search"
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

        <Link to='/cart' className='navbar-search-icon'>
          <img src={assets.basket_icon} alt="Cart" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>

        {!token ? <button className="navbar-signin-btn" onClick={() => setShowLogin(true)}>sign in</button>
          : <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className='navbar-profile-dropdown'>
              <li onClick={()=>navigate('/myorders')}> <img src={assets.bag_icon} alt="" /> <p>Orders</p></li>
              <hr />
              <li onClick={logout}> <img src={assets.logout_icon} alt="" /> <p>Logout</p></li> 
            </ul>
          </div>
        }

      </div>
    </div>
  )
}

export default Navbar
