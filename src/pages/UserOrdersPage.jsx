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

  const progressStages = ["Packaging", "In Transit", "Delivered"];
  const currentStageIndex = progressStages.indexOf(order?.status);

  return (
    <div className="uds-page min-h-screen bg-gray-900 text-white px-6 py-10 font-poppins">
      <h1 className="text-4xl font-bold mb-8 text-center neon-text">Delivery Status</h1>

      {!orderId && !getLastOrderId() ? (
        <p className="text-center text-gray-400">No order ID found. Please checkout first.</p>
      ) : loading ? (
        <p className="text-center text-blue-400">Loading order details…</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : !order ? (
        <p className="text-center text-gray-400">Order not found. Verify your link.</p>
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl backdrop-blur-md border border-gray-700">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <h2 className="text-xl font-semibold text-purple-300">Order ID: {order._id}</h2>
            <p className="text-indigo-400 font-medium capitalize">Status: {order.status}</p>
          </div>

          {/* Progress Bar */}
          <div className="uds-progress-bar mb-10">
            {progressStages.map((stage, index) => {
              const isActive = index <= currentStageIndex;
              return (
                <div key={stage} className="uds-progress-step">
                  <div
                    className={`uds-circle ${isActive ? "active" : ""}`}
                  ></div>
                  <p className="uds-label">{stage}</p>
                  {index < progressStages.length - 1 && (
                    <div
                      className={`uds-line ${index < currentStageIndex ? "active" : ""}`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Products */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {order.products.map((product, idx) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-4 shadow-md flex items-center space-x-4 hover:scale-105 transition-all duration-300">
                <img
                  src={product.image || "/fallback.jpg"}
                  alt={product.name}
                  className="w-20 h-20 rounded object-cover border border-gray-600"
                />
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-300">Qty: {product.quantity}</p>
                  <p className="text-sm text-indigo-300 font-semibold">
                    KSh {(product.price * product.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <p className="text-right mt-6 text-lg font-bold text-indigo-400">
            Total: KSh {order.totalAmount.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDeliveryStatusPage;
