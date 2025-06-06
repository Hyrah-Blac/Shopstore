import React, { useEffect, useState } from 'react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://backend-5za1.onrender.com/api/orders')
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched orders:", data);
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch orders error:", err);
        setError("Could not load orders.");
        setLoading(false);
      });
  }, []);

  const updateStatus = (id, status) => {
    fetch(`https://backend-5za1.onrender.com/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, status: data.order.status } : order
          )
        );
      })
      .catch((err) => console.error(err));
  };

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Order ID</th>
            <th className="py-2">User</th>
            <th className="py-2">Total Amount</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="text-center">
              <td className="py-2">{order._id}</td>
              <td className="py-2">{order.user?.name || "N/A"}</td>
              <td className="py-2">KSh {order.totalAmount.toLocaleString()}</td>
              <td className="py-2">{order.status}</td>
              <td className="py-2">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="Packaging">Packaging</option>
                  <option value="InTransit">InTransit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
