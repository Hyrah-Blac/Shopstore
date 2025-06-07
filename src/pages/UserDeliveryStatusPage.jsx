import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaBoxOpen, FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";
import "./UserDeliveryStatus.css";

const UserDeliveryStatusPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getLastOrderId = () => localStorage.getItem("lastOrderId");

  useEffect(() => {
    const idToFetch = orderId || getLastOrderId();
    if (!idToFetch) {
      setLoading(false);
      return;
    }

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

  const getStatusIcon = (status) => {
    switch ((status || "").toLowerCase()) {
      case "packaging":
        return <FaBoxOpen className="status-icon text-yellow-400" />;
      case "shipped":
        return <FaTruck className="status-icon text-blue-400" />;
      case "delivered":
        return <FaCheckCircle className="status-icon text-green-400" />;
      default:
        return <FaClock className="status-icon text-gray-400" />;
    }
  };

  return (
    <div className="uds-page">
      <h1 className="uds-title">Delivery Status</h1>

      {!orderId && !getLastOrderId() ? (
        <p className="uds-info">No order ID provided. Please complete a checkout first.</p>
      ) : loading ? (
        <p className="uds-info">Loading your order details…</p>
      ) : error ? (
        <p className="uds-error">{error}</p>
      ) : !order ? (
        <p className="uds-info">Order not found. Please verify the link.</p>
      ) : (
        <div className="uds-order-card">
          <div className="uds-header">
            <h2>Order ID: <span className="uds-id">{order._id}</span></h2>
            <div className="uds-status">
              {getStatusIcon(order.status)}
              <span className="uds-status-text">{order.status}</span>
            </div>
          </div>

          <div className="uds-products">
            {order.products.map((product, idx) => (
              <div key={idx} className="uds-product">
                <img
                  src={product.image || "/assets/placeholder.png"}
                  alt={product.name}
                  className="uds-product-image"
                />
                <div className="uds-product-details">
                  <h3>{product.name}</h3>
                  <p>Qty: {product.quantity}</p>
                  <p className="uds-price">KSh {(product.price * product.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="uds-total">
            Total: <span>KSh {order.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDeliveryStatusPage;
