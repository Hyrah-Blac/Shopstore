import React, { useEffect, useState } from 'react';
import './UserDeliveryStatus.css';

const UserDeliveryStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Adjust this based on your auth setup

    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`https://backend-5za1.onrender.com/api/orders/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="uds-loading">Loading your orders...</p>;
  }

  if (orders.length === 0) {
    return <p className="uds-no-orders">You have no orders at the moment.</p>;
  }

  return (
    <div className="uds-container">
      <h1 className="uds-title">Your Delivery Status</h1>

      {orders.map((order) => (
        <div key={order._id} className="uds-order-card">
          <h2 className="uds-order-id">Order ID: {order._id}</h2>
          <p className="uds-total">Total Amount: KSh {order.totalAmount.toLocaleString()}</p>
          <p className="uds-status">
            Status: <span className="uds-status-text">{order.status}</span>
          </p>

          {order.products && order.products.length > 0 && (
            <div className="uds-products-list">
              <h3 className="uds-products-title">Products:</h3>
              {order.products.map((product) => (
                <div key={product._id} className="uds-product-item">
                  <p className="uds-product-name">{product.name}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p>Price: KSh {product.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserDeliveryStatus;
