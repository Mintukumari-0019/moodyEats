import React, { useContext, useState, useEffect } from 'react';
import './Profile.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = ({ setShowLogin }) => {
  const { user, setUser, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipcode: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '+91 98765 43210',
        street: user.street || '42 Gourmet Lane, Green Park',
        city: user.city || 'Bangalore',
        state: user.state || 'Karnataka',
        zipcode: user.zipcode || '560001'
      });
    }
  }, [user]);

  if (!token) {
    return (
      <div className='profile-signin-prompt'>
        <div className='prompt-card'>
          <div className='prompt-icon'>👤</div>
          <h2>Sign in to view your Profile</h2>
          <p>Manage your account settings, saved delivery addresses, and track all your foodie adventures.</p>
          <button 
            type="button" 
            className='prompt-signin-btn' 
            onClick={() => setShowLogin(true)}
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...profileData };
    if (setUser) setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    toast.success("Password updated successfully!");
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    if (setUser) setUser(null);
    toast.info("Logged out successfully");
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className='profile-page'>
      {/* Top Profile Header Card */}
      <div className='profile-hero-card'>
        <div className='profile-avatar-circle'>
          {getInitials(profileData.name)}
        </div>
        <div className='profile-hero-info'>
          <div className='name-badge-row'>
            <h2>{profileData.name || "Foodie Member"}</h2>
            <span className='member-pill'>⭐ Moody Prime Member</span>
          </div>
          <p className='profile-hero-email'>✉️ {profileData.email}</p>
          <p className='profile-hero-phone'>📞 {profileData.phone}</p>
        </div>
        <div className='profile-quick-actions'>
          <Link to='/myorders' className='action-pill-btn'>
            📦 My Orders
          </Link>
          <Link to='/cart' className='action-pill-btn'>
            🛒 View Cart
          </Link>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className='profile-content-grid'>
        {/* Sidebar Nav */}
        <div className='profile-sidebar'>
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            👤 Personal Details
          </button>
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'address' ? 'active' : ''}`}
            onClick={() => setActiveTab('address')}
          >
            📍 Delivery Addresses
          </button>
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Security & Password
          </button>
          <button 
            type="button" 
            className='tab-btn logout-tab'
            onClick={handleLogout}
          >
            🚪 Sign Out
          </button>
        </div>

        {/* Tab Content Display */}
        <div className='profile-tab-content'>
          {/* TAB 1: Personal Details */}
          {activeTab === 'details' && (
            <div className='tab-panel'>
              <div className='tab-header'>
                <div>
                  <h3>Personal Information</h3>
                  <p>Update your personal details and contact number</p>
                </div>
                {!isEditing ? (
                  <button 
                    type="button" 
                    className='edit-profile-btn'
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className='cancel-profile-btn'
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className='profile-form'>
                <div className='form-row'>
                  <div className='form-group'>
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={profileData.name} 
                      onChange={handleProfileChange}
                      disabled={!isEditing} 
                      required 
                    />
                  </div>

                  <div className='form-group'>
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={profileData.email} 
                      disabled={true} 
                      title="Email cannot be changed"
                    />
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group'>
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={profileData.phone} 
                      onChange={handleProfileChange}
                      disabled={!isEditing} 
                    />
                  </div>

                  <div className='form-group'>
                    <label>Preferred Cuisine / Taste</label>
                    <input 
                      type="text" 
                      defaultValue="North Indian, Rolls, Desserts" 
                      disabled={!isEditing} 
                    />
                  </div>
                </div>

                {isEditing && (
                  <button type="submit" className='save-profile-btn'>
                    Save Profile Changes
                  </button>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: Delivery Addresses */}
          {activeTab === 'address' && (
            <div className='tab-panel'>
              <div className='tab-header'>
                <div>
                  <h3>Saved Delivery Addresses</h3>
                  <p>Addresses used during checkout for rapid delivery</p>
                </div>
              </div>

              <div className='address-cards-list'>
                <div className='address-card default-address'>
                  <div className='address-type-tag'>
                    <span>🏠 Primary Delivery Address</span>
                  </div>
                  <h4>{profileData.name}</h4>
                  <p>{profileData.street}</p>
                  <p>{profileData.city}, {profileData.state} - {profileData.zipcode}</p>
                  <p className='address-phone'>📞 {profileData.phone}</p>
                </div>

                <div className='address-card'>
                  <div className='address-type-tag'>
                    <span>🏢 Office Address</span>
                  </div>
                  <h4>{profileData.name} (Work)</h4>
                  <p>Tech Park Tower 4, 3rd Floor</p>
                  <p>Cyber City, {profileData.city} - 560100</p>
                  <p className='address-phone'>📞 {profileData.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Security & Password */}
          {activeTab === 'security' && (
            <div className='tab-panel'>
              <div className='tab-header'>
                <div>
                  <h3>Security & Password</h3>
                  <p>Ensure your account is protected with a strong password</p>
                </div>
              </div>

              <form onSubmit={handleUpdatePassword} className='profile-form'>
                <div className='form-group'>
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    name="currentPassword" 
                    value={passwordData.currentPassword} 
                    onChange={handlePasswordChange}
                    placeholder="Enter current password" 
                    required 
                  />
                </div>

                <div className='form-group'>
                  <label>New Password (min 8 characters)</label>
                  <input 
                    type="password" 
                    name="newPassword" 
                    value={passwordData.newPassword} 
                    onChange={handlePasswordChange}
                    placeholder="Enter new password" 
                    required 
                  />
                </div>

                <div className='form-group'>
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    value={passwordData.confirmPassword} 
                    onChange={handlePasswordChange}
                    placeholder="Re-enter new password" 
                    required 
                  />
                </div>

                <button type="submit" className='save-profile-btn'>
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
