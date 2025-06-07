import React, { useEffect, useState } from "react";
import "./UserDeliveryStatus.css"; // Reuse existing styles
import { useParams } from "react-router-dom";

const UserOrdersPage = () => {
  const { userId } = useParams(); // assuming you're passing userId in route
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("No user ID provided.");
      return;
    }

    setLoading(true);
    fetch(`https://backend-5za1.onrender.com/api/orders/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        const notDelivered = data.filter((order) => order.status !== "delivered");
        setOrders(notDelivered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load orders. Please try again.");
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="uds-page p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      {loading ? (
        <p>Loading orders…</p>
      ) : error ? (
        <p className="uds-error">{error}</p>
      ) : orders.length === 0 ? (
        <p>No active orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="uds-order-card mb-8 p-6 rounded-lg bg-gray-800 shadow-lg"
          >
            <div className="uds-order-header flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <h2 className="uds-order-id text-xl font-semibold">Order ID: {order._id}</h2>
              <p className="uds-order-status mt-2 md:mt-0 text-indigo-400 font-semibold">
                Status: <span className="capitalize">{order.status || "pending"}</span>
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
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-600 flex items-center justify-center text-gray-400 rounded">
                      No Image
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    <p className="text-gray-300 text-sm">
                      Quantity: {product.quantity}
                    </p>
                    <p className="text-indigo-300 font-semibold text-sm">
                      KSh {(product.price * product.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-right font-semibold text-lg text-indigo-400">
              Total: KSh {order.totalAmount.toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default UserOrdersPage;
