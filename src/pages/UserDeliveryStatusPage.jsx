import React, { useEffect, useState } from 'react';
import './UserDeliveryStatusPage.css';

const UserDeliveryStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all orders on mount (no phone input needed)
  useEffect(() => {
    setLoading(true);
    fetch('https://backend-5za1.onrender.com/api/orders') // Adjust API if needed
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="status-page p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="title mb-8 text-3xl font-bold text-indigo-400">
        Delivery Status
      </h1>

      {loading ? (
        <p className="loading">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">You have no orders at the moment.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card mb-8 p-6 rounded-lg bg-gray-800 shadow-lg">
            <h2 className="order-id mb-4 font-semibold text-xl">
              Order ID: {order._id}
            </h2>

            <div className="products-grid">
              {order.products.map((product, index) => (
                <div key={index} className="product-item flex items-center space-x-4 bg-gray-700 rounded p-3">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image rounded object-cover"
                    />
                  ) : (
                    <div className="product-no-image rounded flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="product-name text-lg font-medium">{product.name}</div>
                </div>
              ))}
            </div>

            <p className="order-total mt-4 text-indigo-400 font-semibold text-lg">
              Total: KSh {order.totalAmount.toLocaleString()}
            </p>
            <p className="order-status mt-1 text-gray-300">
              Status: <span className="font-semibold">{order.status}</span>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default UserDeliveryStatus;
