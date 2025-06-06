import React, { useEffect, useState } from 'react';

const UserDeliveryStatus = () => {
  const [orders, setOrders] = useState([]);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all orders on mount automatically
  useEffect(() => {
    setLoading(true);
    fetch('https://backend-5za1.onrender.com/api/orders')  // fetch all orders
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch orders by phone number on button click (optional)
  const fetchOrdersByPhone = () => {
    if (!phone) return; // do nothing if no phone entered
    setLoading(true);
    fetch(`https://backend-5za1.onrender.com/api/orders/user/${phone}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Delivery Status</h1>

      {/* Optional phone search */}
      <div className="mb-4">
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border rounded px-2 py-1 mr-2"
        />
        <button
          onClick={fetchOrdersByPhone}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Check Status
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <p>Loading...</p>
      ) : orders.length > 0 ? (
        // Show orders in separate boxes instead of table for clearer UI
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded p-4 bg-white shadow-md"
            >
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Total Amount:</strong> KSh {order.totalAmount.toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default UserDeliveryStatus;
