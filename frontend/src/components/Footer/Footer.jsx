import React, { useState } from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('🎉 Subscribed! Use promo code MOODY10 for 10% off your next meal.');
    setEmail('');
  };

  return (
    <footer className='modern-footer' id='footer'>
      {/* Newsletter / Promo Strip */}
      <div className='footer-newsletter-strip'>
        <div className='newsletter-content'>
          <div className='newsletter-text'>
            <span className='newsletter-pill'>🎁 Special Offers & Secret Recipes</span>
            <h3>Get ₹100 Off Your First Order</h3>
            <p>Subscribe to our weekly food digest for secret discount codes, new restaurant launches, and gourmet meal tips.</p>
          </div>

          <form onSubmit={handleSubscribe} className='newsletter-form'>
            <div className='newsletter-input-box'>
              <span className='email-icon'>✉️</span>
              <input 
                type="email" 
                placeholder="Enter your email address..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className='newsletter-btn'>
                <span>{subscribed ? "Subscribed! ✓" : "Claim Discount"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className='footer-trust-bar'>
        <div className='trust-item'>
          <span className='trust-icon'>⚡</span>
          <div>
            <b>30-Min Fast Delivery</b>
            <p>Hot meals delivered piping hot to your door</p>
          </div>
        </div>
        <div className='trust-item'>
          <span className='trust-icon'>🛡️</span>
          <div>
            <b>100% Hygienic Packaging</b>
            <p>Contactless delivery & sanitized food containers</p>
          </div>
        </div>
        <div className='trust-item'>
          <span className='trust-icon'>💳</span>
          <div>
            <b>Secure Payments</b>
            <p>Stripe card checkout, NetBanking & Cash on Delivery</p>
          </div>
        </div>
        <div className='trust-item'>
          <span className='trust-icon'>⭐</span>
          <div>
            <b>4.9/5 Rating (15k+ Reviews)</b>
            <p>Loved by foodies across the city</p>
          </div>
        </div>
      </div>

      {/* Main 4-Column Grid */}
      <div className="footer-main-grid">
        {/* Column 1: Brand & Bio */}
        <div className="footer-col footer-col-brand">
          <Link to='/' className='footer-brand-logo'>
            <span className='footer-logo-emoji'>🍔</span>
            <h2 className='logo-text'>
              Moody<span>Eats</span>
            </h2>
          </Link>
          <p className='brand-desc'>
            MoodyEats connects food lovers with the finest neighborhood restaurants, gourmet kitchens, and fresh home-style culinary masters. Cooked with passion, delivered with speed.
          </p>

          <div className='operating-status-pill'>
            <span className='live-dot'></span>
            <span>Kitchen Open 24/7 for Online Orders</span>
          </div>

          <div className="footer-social-row">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Follow us on Facebook" className='social-circle'>
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" title="Follow us on Twitter" className='social-circle'>
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="Connect on LinkedIn" className='social-circle'>
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="footer-col">
          <h4 className='footer-col-title'>QUICK EXPLORE</h4>
          <ul className='footer-links-list'>
            <li><Link to="/">🏠 Home Showcase</Link></li>
            <li><a href="/#explore-menu">🍽️ Category Menu</a></li>
            <li><a href="/#food-display">🔥 Trending Dishes</a></li>
            <li><Link to="/cart">🛒 View Shopping Cart</Link></li>
            <li><Link to="/myorders">📦 Live Order Tracker</Link></li>
            <li><Link to="/profile">👤 Account Profile</Link></li>
          </ul>
        </div>

        {/* Column 3: Top Cuisines */}
        <div className="footer-col">
          <h4 className='footer-col-title'>POPULAR CUISINES</h4>
          <ul className='footer-links-list'>
            <li><a href="/#food-display">🥗 Gourmet Fresh Salads</a></li>
            <li><a href="/#food-display">🌯 Crispy Stuffed Rolls</a></li>
            <li><a href="/#food-display">🍝 Italian Truffle Pastas</a></li>
            <li><a href="/#food-display">🥪 Artisan Grilled Sandwiches</a></li>
            <li><a href="/#food-display">🍰 Handcrafted Desserts & Cakes</a></li>
            <li><a href="/#food-display">🍜 Authentic Stir-Fried Noodles</a></li>
          </ul>
        </div>

        {/* Column 4: Contact & Helpline */}
        <div className="footer-col footer-col-contact">
          <h4 className='footer-col-title'>HELP & SUPPORT</h4>
          <div className='contact-card-box'>
            <div className='contact-line'>
              <span className='contact-icon'>📞</span>
              <div>
                <b>Toll-Free 24/7 Helpline</b>
                <a href="tel:+919876543210">+91 98765 43210</a>
              </div>
            </div>

            <div className='contact-line'>
              <span className='contact-icon'>✉️</span>
              <div>
                <b>Customer Care Email</b>
                <a href="mailto:support@moodyeats.com">support@moodyeats.com</a>
              </div>
            </div>

            <div className='contact-line'>
              <span className='contact-icon'>📍</span>
              <div>
                <b>Headquarters</b>
                <span>123 Food Street, Tech Park, India</span>
              </div>
            </div>

            <Link to="/contact" className='footer-support-btn'>
              Visit Help & Support Center →
            </Link>
          </div>
        </div>
      </div>

      {/* Payment & App Store Strip */}
      <div className='footer-payment-strip'>
        <div className='payment-methods-row'>
          <span className='payment-label'>Safe Payment Methods:</span>
          <div className='payment-badges'>
            <span className='pay-chip'>💳 Visa</span>
            <span className='pay-chip'>💳 Mastercard</span>
            <span className='pay-chip'>🌐 Stripe Secure</span>
            <span className='pay-chip'>📱 UPI / NetBanking</span>
            <span className='pay-chip'>💵 Cash on Delivery</span>
          </div>
        </div>

        <div className='admin-quick-jump'>
          <a href="http://localhost:5174/" target="_blank" rel="noopener noreferrer" className='admin-portal-link'>
            ⚙️ Admin Panel Console ↗
          </a>
        </div>
      </div>

      <hr className='footer-divider' />

      {/* Bottom Bar: Copyright & Legal */}
      <div className='footer-bottom-bar'>
        <p className="footer-copyright">
          Copyright {new Date().getFullYear()} © <b>MoodyEats Food Delivery Inc.</b> All rights reserved.
        </p>

        <div className='footer-legal-links'>
          <a href="#privacy">Privacy Policy</a>
          <span className='separator'>•</span>
          <a href="#terms">Terms of Service</a>
          <span className='separator'>•</span>
          <a href="#security">Security</a>
          <span className='separator'>•</span>
          <a href="#cookies">Cookie Preferences</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
