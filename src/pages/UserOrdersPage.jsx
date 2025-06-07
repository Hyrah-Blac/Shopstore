import React, { useEffect, useState } from 'react';
import { FaBoxOpen, FaTruck, FaCheckCircle, FaClock } from 'react-icons/fa';

const statusIcon = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'packaging':
      return <FaBoxOpen className="status-icon packaging" />;
    case 'shipped':
      return <FaTruck className="status-icon shipped" />;
    case 'delivered':
      return <FaCheckCircle className="status-icon delivered" />;
    default:
      return <FaClock className="status-icon pending" />;
  }
};

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setError('User not logged in.');
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`https://backend-5za1.onrender.com/api/orders/user/${userId}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Fetch user orders error:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="uop-page p-6 min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white font-sans">
      <h1 className="uop-title text-4xl font-extrabold mb-8 text-center tracking-wide text-teal-400 drop-shadow-lg">
        Your Orders
      </h1>

      {loading ? (
        <p className="uop-info text-teal-300 animate-pulse text-center">Loading orders...</p>
      ) : error ? (
        <p className="uop-error text-red-500 text-center font-semibold">{error}</p>
      ) : orders.length === 0 ? (
        <p className="uop-info text-gray-400 text-center">You have not placed any orders yet.</p>
      ) : (
        <div className="uop-orders-list space-y-8 max-w-7xl mx-auto">
          {orders.map((order) => (
            <div
              key={order._id}
              className="uop-order-card bg-gray-850 bg-opacity-80 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-teal-600 transition-shadow duration-300"
            >
              <div className="uop-order-header flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <div className="uop-order-id font-semibold text-xl text-teal-400 tracking-wide break-words">
                  Order ID: <span className="font-mono text-indigo-300">{order._id}</span>
                </div>
                <div className="uop-status flex items-center space-x-3 mt-3 md:mt-0 text-lg font-semibold">
                  {statusIcon(order.status)}
                  <span
                    className={`uop-status-text capitalize ${
                      order.status === 'Delivered' ? 'delivered' : 'pending'
                    }`}
                  >
                    {order.status || 'Pending'}
                  </span>
                </div>
                <div className="uop-total mt-3 md:mt-0 font-semibold text-teal-300 text-lg">
                  Total: KSh {order.totalAmount?.toLocaleString()}
                </div>
              </div>

              <div className="uop-products grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {order.products.map((product) => (
                  <div
                    key={product.id || product._id}
                    className="uop-product-card bg-gray-800 rounded-xl p-4 flex flex-col items-center shadow-md hover:shadow-teal-500 transition-shadow duration-300"
                  >
                    <img
                      src={product.image || '/fallback.jpg'}
                      alt={product.title || 'Product'}
                      className="uop-product-image w-28 h-28 object-cover rounded-lg mb-3 border border-gray-700"
                    />
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-1">{product.title || 'Unnamed Product'}</h3>
                      <p className="text-indigo-300 font-mono mb-1">KSh {product.price?.toLocaleString() || '0'}</p>
                      <p className="text-gray-400 text-sm">Qty: {product.quantity || 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;
