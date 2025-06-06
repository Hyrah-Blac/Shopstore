import React, { useEffect, useState } from "react";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://backend-5za1.onrender.com/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`https://backend-5za1.onrender.com/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      // Update local state to reflect status change
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="admin-orders-container">
      <h1>All Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="order-card" style={{border:"1px solid #ccc", margin:"1rem", padding:"1rem"}}>
          <h3>Order ID: {order._id}</h3>
          <p>
            <strong>User:</strong> {order.user.name} <br />
            <strong>Phone:</strong> {order.user.phone} <br />
            <strong>Address:</strong> {order.user.address}
          </p>

          <div>
            <h4>Products:</h4>
            {order.products.map((prod) => (
              <div key={prod.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                <img
                  src={prod.image}
                  alt={prod.name}
                  style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "1rem" }}
                />
                <div>
                  <p>{prod.name}</p>
                  <p>
                    Quantity: {prod.quantity} x KSh {prod.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p>
            <strong>Total Amount:</strong> KSh {order.totalAmount.toLocaleString()}
          </p>

          <p>
            <strong>Status:</strong> {order.status}
          </p>

          <div>
            <label>Update Status:</label>
            <select
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
            >
              <option value="Packaging">Packaging</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrdersPage;
