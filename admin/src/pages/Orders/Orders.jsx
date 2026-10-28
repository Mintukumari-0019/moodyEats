import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus
      });
      if (response.data.success) {
        toast.success(`Order status updated to: ${newStatus}`);
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      } else {
        toast.error("Status update failed");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "Pending" || !o.status).length,
    processing: orders.filter(o => o.status === "Food Processing").length,
    delivery: orders.filter(o => o.status === "Out for delivery").length,
    delivered: orders.filter(o => o.status === "Delivered").length,
    cancelled: orders.filter(o => o.status === "Cancelled").length,
  };

  const filteredOrders = orders.filter((order) => {
    const orderStatus = order.status || 'Pending';
    const matchesStatus = statusFilter === 'All' || orderStatus === statusFilter;
    const address = order.address || {};
    const fullName = `${address.firstName || ''} ${address.lastName || ''}`.toLowerCase();
    const phone = (address.phone || '').toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || fullName.includes(q) || phone.includes(q) || (order._id || '').toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className='orders-container'>
      <div className='orders-header'>
        <div>
          <h3>Customer Orders Dispatch</h3>
          <p className='orders-subtitle'>Live tracking, delivery coordination, and real-time status management.</p>
        </div>
        <button className='refresh-orders-btn' onClick={fetchAllOrders} disabled={loading}>
          <span className={loading ? 'spin-icon' : ''}>🔄</span>
          <span>{loading ? "Syncing..." : "Refresh Orders"}</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className='orders-toolbar'>
        <div className='orders-status-tabs'>
          <button 
            type="button"
            className={`status-tab-btn ${statusFilter === 'All' ? 'active' : ''}`}
            onClick={() => setStatusFilter('All')}
          >
            All ({counts.all})
          </button>
          <button 
            type="button"
            className={`status-tab-btn ${statusFilter === 'Pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Pending')}
          >
            Pending ({counts.pending})
          </button>
          <button 
            type="button"
            className={`status-tab-btn ${statusFilter === 'Food Processing' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Food Processing')}
          >
            Processing ({counts.processing})
          </button>
          <button 
            type="button"
            className={`status-tab-btn ${statusFilter === 'Out for delivery' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Out for delivery')}
          >
            Out for Delivery ({counts.delivery})
          </button>
          <button 
            type="button"
            className={`status-tab-btn ${statusFilter === 'Delivered' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Delivered')}
          >
            Delivered ({counts.delivered})
          </button>
          {counts.cancelled > 0 && (
            <button 
              type="button"
              className={`status-tab-btn ${statusFilter === 'Cancelled' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Cancelled')}
            >
              Cancelled ({counts.cancelled})
            </button>
          )}
        </div>

        <div className='orders-search-box'>
          <span>🔍</span>
          <input 
            type="text" 
            placeholder="Search by customer name, phone, or order ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className='clear-search' onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className='orders-loading'>
          <div className='admin-spinner'></div>
          <p>Retrieving orders from server...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className='orders-empty'>
          <span className='empty-emoji'>📦</span>
          <h4>No orders found</h4>
          <p>
            {searchQuery || statusFilter !== 'All' 
              ? 'Try resetting your status filter or search query.' 
              : 'No orders have been received yet. As soon as a customer orders, it will appear here.'}
          </p>
        </div>
      ) : (
        <div className='orders-list'>
          {filteredOrders.map((order, index) => {
            const address = order.address || {};
            const fullName = `${address.firstName || ''} ${address.lastName || ''}`.trim() || 'Customer';
            const fullAddress = [address.street, address.city, address.state, address.zipcode, address.country].filter(Boolean).join(", ");
            const orderIdSnippet = (order._id || "").slice(-6).toUpperCase();
            const currentStatus = order.status || 'Pending';
            const statusClass = currentStatus.toLowerCase().replace(/\s+/g, '-');

            return (
              <div key={order._id || index} className={`order-card card-status-${statusClass}`}>
                <div className='order-card-icon'>
                  <img src={assets.parcel_icon} alt="Parcel" />
                </div>

                <div className='order-details'>
                  <div className='order-header-line'>
                    <span className='order-tag-id'>#{orderIdSnippet || index + 1}</span>
                    <span className='order-date-text'>
                      {order.date ? new Date(order.date).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <p className='order-items-text'>
                    {order.items && order.items.map((item, itemIdx) => (
                      <span key={itemIdx} className='order-dish-item'>
                        {item.name} <b>× {item.quantity}</b>{itemIdx < order.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>

                  <div className='order-customer-info'>
                    <b className='order-customer-name'>👤 {fullName}</b>
                    <p className='order-customer-address'>📍 {fullAddress || "Address provided"}</p>
                    {address.phone && (
                      <span className='order-customer-phone'>📞 {address.phone}</span>
                    )}
                  </div>
                </div>

                <div className='order-meta'>
                  <span className='order-items-count'>
                    {(order.items || []).reduce((acc, curr) => acc + (curr.quantity || 1), 0)} items
                  </span>
                  <span className='order-amount'>{currency}{order.amount}</span>
                  <span className={`payment-badge ${order.payment ? 'paid' : 'unpaid'}`}>
                    {order.payment ? "PAID ONLINE" : "CASH ON DELIVERY"}
                  </span>
                </div>

                <div className='order-status-control'>
                  <label htmlFor={`status-${order._id || index}`}>Fulfillment Stage:</label>
                  <select 
                    id={`status-${order._id || index}`}
                    onChange={(event) => statusHandler(event, order._id)} 
                    value={currentStatus}
                    className={`status-select ${statusClass}`}
                  >
                    <option value="Pending">⏳ Pending Approval</option>
                    <option value="Food Processing">🍳 Kitchen Processing</option>
                    <option value="Out for delivery">🛵 Out for Delivery</option>
                    <option value="Delivered">✅ Delivered</option>
                    <option value="Cancelled">❌ Cancelled</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
