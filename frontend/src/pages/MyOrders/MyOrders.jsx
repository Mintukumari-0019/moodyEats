import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url, token, currency } = useContext(StoreContext);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      if (response.data.success) {
        setData(response.data.data || []);
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  const getStatusLevel = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("cancel")) return -1;
    if (s.includes("delivered")) return 4;
    if (s.includes("out") || s.includes("delivery")) return 3;
    if (s.includes("process") || s.includes("kitchen")) return 2;
    return 1; // Pending
  };

  const getStatusDisplay = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("cancel")) {
      return { label: "Cancelled / Not Delivered", className: "cancelled", icon: "❌" };
    }
    if (s.includes("delivered")) {
      return { label: "Delivered", className: "delivered", icon: "✅" };
    }
    if (s.includes("out") || s.includes("delivery")) {
      return { label: "Out for Delivery", className: "out-for-delivery", icon: "🛵" };
    }
    if (s.includes("process")) {
      return { label: "Food Processing (Kitchen)", className: "processing", icon: "🍳" };
    }
    return { label: "Order Placed / Pending", className: "pending", icon: "⏳" };
  };

  if (!token) {
    return (
      <div className='my-orders-empty'>
        <h3>Please Sign In</h3>
        <p>You need to be logged in to view your order history and track deliveries.</p>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }

  return (
    <div className='my-orders'>
      <div className='my-orders-header'>
        <div>
          <h2>My Order History & Live Tracking</h2>
          <p className='orders-subheading'>Real-time tracking for pending, kitchen, and delivered orders</p>
        </div>
        <button className='refresh-btn' onClick={fetchOrders} title="Refresh order status">
          🔄 Refresh Orders
        </button>
      </div>

      {loading ? (
        <div className='my-orders-loading'>
          <p>Loading your orders...</p>
        </div>
      ) : data.length === 0 ? (
        <div className='my-orders-empty'>
          <div className='empty-orders-icon'>📦</div>
          <h3>No Orders Found</h3>
          <p>You haven't placed any orders yet. Discover our fresh cuisines and treat yourself!</p>
          <button onClick={() => navigate('/')}>Order Delicious Food</button>
        </div>
      ) : (
        <div className="orders-container">
          {data.map((order, index) => {
            const items = order.items || [];
            const level = getStatusLevel(order.status);
            const statusInfo = getStatusDisplay(order.status);

            return (
              <div key={order._id || index} className={`my-orders-order-card ${statusInfo.className}`}>
                {/* Header row inside card */}
                <div className='card-top-row'>
                  <div className='order-id-date'>
                    <img src={assets.parcel_icon} alt="Parcel" className='parcel-icon' />
                    <div>
                      <span className='order-id-label'>Order #{order._id ? order._id.slice(-6).toUpperCase() : `MOODY${index + 1}`}</span>
                      <p className='order-date'>
                        {order.date ? new Date(order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Just Now"}
                      </p>
                    </div>
                  </div>

                  <div className='order-status-badge-container'>
                    <span className={`status-pill ${statusInfo.className}`}>
                      <span className='status-dot'></span>
                      <b>{statusInfo.icon} {statusInfo.label}</b>
                    </span>
                  </div>
                </div>

                {/* Items & Amount */}
                <div className='card-middle-row'>
                  <div className='order-items-column'>
                    <p className='items-text'>
                      {items.map((item, idx) => (
                        <span key={idx}>
                          <b>{item.name}</b> x {item.quantity}{idx < items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  </div>

                  <div className='order-amount-column'>
                    <span className='amount-label'>Total Paid:</span>
                    <span className='amount-val'>{currency}{order.amount}</span>
                    <span className={`order-payment-type ${order.payment ? 'paid' : 'cod'}`}>
                      {order.payment ? "💳 PAID ONLINE" : "💵 CASH ON DELIVERY"}
                    </span>
                  </div>
                </div>

                {/* Status Progress Tracker */}
                {level === -1 ? (
                  <div className='cancelled-alert-banner'>
                    <span>⚠️ <b>Order Cancelled / Not Delivered:</b> This order was cancelled or could not be delivered. Contact support if you need assistance.</span>
                  </div>
                ) : (
                  <div className='order-progress-tracker'>
                    <div className={`step-item ${level >= 1 ? 'completed' : ''}`}>
                      <div className='step-circle'>{level >= 1 ? '✓' : '1'}</div>
                      <span className='step-label'>Order Placed</span>
                    </div>
                    <div className={`step-line ${level >= 2 ? 'completed' : ''}`}></div>

                    <div className={`step-item ${level >= 2 ? 'completed' : ''} ${level === 2 ? 'active' : ''}`}>
                      <div className='step-circle'>{level > 2 ? '✓' : '2'}</div>
                      <span className='step-label'>Kitchen Prep</span>
                    </div>
                    <div className={`step-line ${level >= 3 ? 'completed' : ''}`}></div>

                    <div className={`step-item ${level >= 3 ? 'completed' : ''} ${level === 3 ? 'active' : ''}`}>
                      <div className='step-circle'>{level > 3 ? '✓' : '3'}</div>
                      <span className='step-label'>Out for Delivery</span>
                    </div>
                    <div className={`step-line ${level >= 4 ? 'completed' : ''}`}></div>

                    <div className={`step-item ${level >= 4 ? 'completed' : ''}`}>
                      <div className='step-circle'>{level >= 4 ? '✓' : '4'}</div>
                      <span className='step-label'>{level === 4 ? 'Delivered 🎉' : 'Delivery'}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
