import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://backend-5za1.onrender.com/api/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load orders.");
        setLoading(false);
      });
  }, []);

  const updateStatus = (id, newStatus) => {
    if (
      !window.confirm(
        `Are you sure you want to change order status to "${newStatus}"?`
      )
    )
      return;

    setUpdatingId(id);

    fetch(`https://backend-5za1.onrender.com/api/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .then((data) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, status: data.order.status } : order
          )
        );
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update order status. Please try again.");
      })
      .finally(() => {
        setUpdatingId(null);
      });
  };

  if (loading)
    return <div className="p-4 text-center text-gray-600">Loading orders...</div>;

  if (error)
    return (
      <div className="p-4 text-center text-red-600 font-semibold">{error}</div>
    );

  if (orders.length === 0)
    return (
      <div className="p-4 text-center text-gray-600 font-semibold">
        No orders found.
      </div>
    );

  return (
    <div className="p-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      <table className="min-w-full border border-gray-300 bg-white text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 border-b border-gray-300">Order ID</th>
            <th className="py-2 border-b border-gray-300">User</th>
            <th className="py-2 border-b border-gray-300">Total Amount</th>
            <th className="py-2 border-b border-gray-300">Status</th>
            <th className="py-2 border-b border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="py-2 border-b border-gray-300 font-mono text-sm break-all">
                {order._id}
              </td>
              <td className="py-2 border-b border-gray-300">
                {order.user?.name || "N/A"}
              </td>
              <td className="py-2 border-b border-gray-300">
                KSh {Number(order.totalAmount || 0).toLocaleString()}
              </td>
              <td className="py-2 border-b border-gray-300 capitalize">{order.status}</td>
              <td className="py-2 border-b border-gray-300">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="border rounded px-2 py-1"
                  disabled={updatingId === order._id}
                >
                  <option value="Packaging">Packaging</option>
                  <option value="InTransit">In Transit</option>
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
