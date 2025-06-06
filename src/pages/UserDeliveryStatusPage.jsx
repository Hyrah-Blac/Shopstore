import React, { useEffect, useState } from 'react';

const UserDeliveryStatus = () => {
  const [orders, setOrders] = useState([]);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchOrders = () => {
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
      <div className="mb-4">
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border rounded px-2 py-1 mr-2"
        />
        <button onClick={fetchOrders} className="bg-blue-500 text-white px-4 py-1 rounded">
          Check Status
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Order ID</th>
              <th className="py-2">Total Amount</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="py-2">{order._id}</td>
                <td className="py-2">KSh {order.totalAmount.toLocaleString()}</td>
                <td className="py-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found for this phone number.</p>
      )}
    </div>
  );
};

export default UserDeliveryStatus;
