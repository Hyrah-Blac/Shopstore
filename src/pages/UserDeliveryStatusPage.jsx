import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './UserDeliveryStatus.css';

const UserDeliveryStatusPage = () => {
  const params = useParams();
  const orderId = params.orderId || localStorage.getItem("lastOrderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`https://backend-5za1.onrender.com/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch order");
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load order. Please check your link or try again.");
        setLoading(false);
      });
  }, [orderId]);

  return (
    <div className="uds-page p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="uds-title text-3xl font-bold mb-6">Delivery Status</h1>

      {!orderId ? (
        <p className="uds-no-id">
          No order ID provided. Please complete a checkout first to view status.
        </p>
      ) : loading ? (
        <p className="uds-loading">Loading order details…</p>
      ) : error ? (
        <p className="uds-error">{error}</p>
      ) : !order ? (
        <p className="uds-no-orders">Order not found. Please verify the link.</p>
      ) : (
        <div className="uds-order-card mb-8 p-6 rounded-lg bg-gray-800 shadow-lg">
          <div className="uds-order-header flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h2 className="uds-order-id text-xl font-semibold">Order ID: {order._id}</h2>
            <p className="uds-order-status mt-2 md:mt-0 text-indigo-400 font-semibold">
              Status: <span className="capitalize">{order.status || 'pending'}</span>
            </p>
          </div>

          <div className="uds-products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {order.products.map((product, idx) => (
              <div
                key={idx}
                className="uds-product-item flex items-center space-x-4 bg-gray-700 rounded p-3"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="uds-product-image w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="uds-no-image w-20 h-20 bg-gray-600 flex items-center justify-center text-gray-400 rounded">
                    No Image
                  </div>
                )}
                <div>
                  <h3 className="uds-product-name text-lg font-medium">{product.name}</h3>
                  <p className="uds-product-qty text-gray-300 text-sm">
                    Quantity: {product.quantity}
                  </p>
                  <p className="uds-product-price text-indigo-300 font-semibold text-sm">
                    KSh {(product.price * product.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="uds-total mt-6 text-right font-semibold text-lg text-indigo-400">
            Total: KSh {order.totalAmount.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDeliveryStatusPage;
