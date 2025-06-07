import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./UserDeliveryStatus.css";

const UserDeliveryStatusPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getLastOrderId = () => localStorage.getItem("lastOrderId");

  useEffect(() => {
    const idToFetch = orderId || getLastOrderId();
    if (!idToFetch) return setLoading(false);

    setLoading(true);
    fetch(`https://backend-5za1.onrender.com/api/orders/${idToFetch}`)
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
    <div className="uds-page">
      <h1 className="uds-title">📦 Delivery Status</h1>

      {!orderId && !getLastOrderId() ? (
        <p className="uds-message">No order ID provided. Please complete checkout to view your order status.</p>
      ) : loading ? (
        <p className="uds-message uds-loading">⏳ Loading your order details...</p>
      ) : error ? (
        <p className="uds-message uds-error">❌ {error}</p>
      ) : !order ? (
        <p className="uds-message">Order not found. Please verify your link.</p>
      ) : (
        <div className="uds-order-card animate-fade-in">
          <div className="uds-order-header">
            <h2>🧾 Order ID: <span>{order._id}</span></h2>
            <p className="uds-status">Status: <span>{order.status || "pending"}</span></p>
          </div>

          <div className="uds-products">
            {order.products.map((product, idx) => (
              <div key={idx} className="uds-product">
                <img
                  src={product.image || "/assets/placeholder.png"}
                  alt={product.name}
                  className="uds-product-image"
                />
                <div className="uds-product-info">
                  <h3>{product.name}</h3>
                  <p>Qty: {product.quantity}</p>
                  <p className="uds-product-price">
                    KSh {(product.price * product.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="uds-total">
            Total: <span>KSh {order.totalAmount.toLocaleString()}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDeliveryStatusPage;
