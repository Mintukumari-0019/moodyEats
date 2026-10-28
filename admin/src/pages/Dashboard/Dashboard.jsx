import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import axios from 'axios';
import { url, currency } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [foodsRes, ordersRes] = await Promise.allSettled([
        axios.get(`${url}/api/food/list`),
        axios.get(`${url}/api/order/list`)
      ]);

      if (foodsRes.status === "fulfilled" && foodsRes.value.data.success) {
        setFoods(foodsRes.value.data.data || []);
      }
      if (ordersRes.status === "fulfilled" && ordersRes.value.data.success) {
        setOrders(ordersRes.value.data.data || []);
      }
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "Pending" || !o.status);
  const processingOrders = orders.filter(o => o.status === "Food Processing");
  const deliveringOrders = orders.filter(o => o.status === "Out for delivery");
  const deliveredOrders = orders.filter(o => o.status === "Delivered");
  const cancelledOrders = orders.filter(o => o.status === "Cancelled");
  const activeOrdersCount = pendingOrders.length + processingOrders.length + deliveringOrders.length;

  const recentOrders = orders.slice(0, 6);

  return (
    <div className='dashboard-container'>
      {/* Welcome Banner */}
      <div className='dashboard-header'>
        <div className='dashboard-header-text'>
          <h2>Dashboard Overview</h2>
          <p>Real-time analytics, inventory counts, and customer order pipeline.</p>
        </div>
        <div className='dashboard-header-actions'>
          {lastUpdated && <span className='last-sync-tag'>Synced at {lastUpdated}</span>}
          <button className='refresh-stats-btn' onClick={fetchStats} disabled={loading} title="Refresh data">
            <span className={loading ? 'spin-icon' : ''}>🔄</span>
            <span>{loading ? "Refreshing..." : "Sync Stats"}</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className='metrics-grid'>
        <div className='metric-card revenue-card'>
          <div className='metric-top-bar bar-orange'></div>
          <div className='metric-body'>
            <div className='metric-info'>
              <span className='metric-label'>Gross Revenue</span>
              <h3 className='metric-value'>{currency}{totalRevenue.toLocaleString()}</h3>
              <div className='metric-sub-badge'>
                <span className='trend-pill trend-up'>↑ Active Sales</span>
                <span className='metric-subtext'>Lifetime volume</span>
              </div>
            </div>
            <div className='metric-icon-box box-orange'>💰</div>
          </div>
        </div>

        <div className='metric-card orders-card'>
          <div className='metric-top-bar bar-blue'></div>
          <div className='metric-body'>
            <div className='metric-info'>
              <span className='metric-label'>Total Orders</span>
              <h3 className='metric-value'>{orders.length}</h3>
              <div className='metric-sub-badge'>
                <span className='trend-pill trend-blue'>{deliveredOrders.length} Completed</span>
                <span className='metric-subtext'>Deliveries made</span>
              </div>
            </div>
            <div className='metric-icon-box box-blue'>📦</div>
          </div>
        </div>

        <div className='metric-card active-card'>
          <div className='metric-top-bar bar-amber'></div>
          <div className='metric-body'>
            <div className='metric-info'>
              <span className='metric-label'>Live Kitchen Orders</span>
              <h3 className='metric-value'>{activeOrdersCount}</h3>
              <div className='metric-sub-badge'>
                <span className='trend-pill trend-amber'>⚡ Needs Dispatch</span>
                <span className='metric-subtext'>In preparation</span>
              </div>
            </div>
            <div className='metric-icon-box box-amber'>🛵</div>
          </div>
        </div>

        <div className='metric-card foods-card'>
          <div className='metric-top-bar bar-green'></div>
          <div className='metric-body'>
            <div className='metric-info'>
              <span className='metric-label'>Menu Catalog</span>
              <h3 className='metric-value'>{foods.length}</h3>
              <div className='metric-sub-badge'>
                <span className='trend-pill trend-green'>🥗 Active Dishes</span>
                <span className='metric-subtext'>Available for order</span>
              </div>
            </div>
            <div className='metric-icon-box box-green'>🍔</div>
          </div>
        </div>
      </div>

      {/* Visual Order Workflow Distribution Bar */}
      {orders.length > 0 && (
        <div className='order-pipeline-card'>
          <div className='pipeline-header'>
            <h4>Order Fulfillment Pipeline</h4>
            <span className='pipeline-total-badge'>{orders.length} Total Orders Recorded</span>
          </div>
          <div className='pipeline-bar-wrapper'>
            <div 
              className='pipeline-segment segment-pending' 
              style={{ width: `${Math.max(5, (pendingOrders.length / orders.length) * 100)}%` }}
              title={`Pending: ${pendingOrders.length}`}
            ></div>
            <div 
              className='pipeline-segment segment-processing' 
              style={{ width: `${Math.max(5, (processingOrders.length / orders.length) * 100)}%` }}
              title={`Processing: ${processingOrders.length}`}
            ></div>
            <div 
              className='pipeline-segment segment-delivery' 
              style={{ width: `${Math.max(5, (deliveringOrders.length / orders.length) * 100)}%` }}
              title={`Out for Delivery: ${deliveringOrders.length}`}
            ></div>
            <div 
              className='pipeline-segment segment-delivered' 
              style={{ width: `${Math.max(5, (deliveredOrders.length / orders.length) * 100)}%` }}
              title={`Delivered: ${deliveredOrders.length}`}
            ></div>
          </div>
          <div className='pipeline-legend'>
            <div className='legend-item'><span className='dot dot-amber'></span> Pending ({pendingOrders.length})</div>
            <div className='legend-item'><span className='dot dot-orange'></span> Processing ({processingOrders.length})</div>
            <div className='legend-item'><span className='dot dot-blue'></span> Out for Delivery ({deliveringOrders.length})</div>
            <div className='legend-item'><span className='dot dot-green'></span> Delivered ({deliveredOrders.length})</div>
            {cancelledOrders.length > 0 && (
              <div className='legend-item'><span className='dot dot-red'></span> Cancelled ({cancelledOrders.length})</div>
            )}
          </div>
        </div>
      )}

      {/* Quick Action Shortcuts */}
      <div className='quick-actions-bar'>
        <Link to='/add' className='quick-action-card'>
          <div className='action-icon-circle'>➕</div>
          <div className='action-details'>
            <h4>Add New Food Item</h4>
            <p>Publish dish with category, price, and photo</p>
          </div>
          <span className='action-arrow'>→</span>
        </Link>

        <Link to='/orders' className='quick-action-card'>
          <div className='action-icon-circle'>🛵</div>
          <div className='action-details'>
            <h4>Live Order Management</h4>
            <p>Update customer fulfillment & delivery stages</p>
          </div>
          <span className='action-arrow'>→</span>
        </Link>

        <Link to='/list' className='quick-action-card'>
          <div className='action-icon-circle'>📋</div>
          <div className='action-details'>
            <h4>Menu Inventory List</h4>
            <p>Edit prices, update details, or remove dishes</p>
          </div>
          <span className='action-arrow'>→</span>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className='recent-orders-section'>
        <div className='section-title-row'>
          <div>
            <h3>Recent Orders Feed</h3>
            <span className='section-subtext'>Latest customer transactions and payment modes</span>
          </div>
          <Link to='/orders' className='view-all-link'>View All Orders ({orders.length}) →</Link>
        </div>

        {loading ? (
          <div className='dashboard-loading'>
            <div className='admin-spinner'></div>
            <p>Synchronizing recent orders...</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className='dashboard-empty'>
            <span className='empty-emoji'>📦</span>
            <p>No orders placed yet. Once customers order, they will appear here live.</p>
          </div>
        ) : (
          <div className='recent-orders-table-wrapper'>
            <table className='recent-orders-table'>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items Summary</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => {
                  const address = order.address || {};
                  const fullName = [address.firstName, address.lastName].filter(Boolean).join(" ") || "Customer";
                  const orderIdSnippet = (order._id || "").slice(-6).toUpperCase();
                  const statusClass = (order.status || "Food Processing").toLowerCase().replace(/\s+/g, '-');

                  return (
                    <tr key={order._id || idx}>
                      <td>
                        <span className='order-id-chip'>#{orderIdSnippet || idx + 1}</span>
                      </td>
                      <td>
                        <div className='customer-cell'>
                          <div className='customer-avatar-small'>
                            {fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className='customer-text-col'>
                            <b className='customer-name'>{fullName}</b>
                            <span className='customer-phone'>{address.phone || "No phone"}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className='items-summary'>
                          {(order.items || []).map(i => `${i.name} × ${i.quantity}`).join(", ") || "Food items"}
                        </span>
                      </td>
                      <td className='amount-cell'>
                        <b>{currency}{order.amount}</b>
                      </td>
                      <td>
                        <span className={`status-badge ${statusClass}`}>
                          {order.status || "Food Processing"}
                        </span>
                      </td>
                      <td>
                        <span className={`payment-pill ${order.payment ? 'paid' : 'cod'}`}>
                          {order.payment ? "PAID" : "COD"}
                        </span>
                      </td>
                      <td>
                        <Link to='/orders' className='table-view-btn' title="Manage this order">
                          Manage →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
