import React, { useEffect, useState } from 'react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('https://backend-5za1.onrender.com/api/orders')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch((err) => {
        console.error('Fetch orders error:', err);
        setOrders([]);
      });
  }, []);

  const updateStatus = (id, status) => {
    fetch(`https://backend-5za1.onrender.com/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, status: data.order.status } : order
          )
        );
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Orders</h1>
      {orders.length === 0 ? (
        <p className="text-red-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-gray-900 text-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Order ID: {order._id}</h2>
              <p><strong>User:</strong> {order.user?.name}</p>
              <p><strong>Address:</strong> {order.user?.address || 'N/A'}</p>
              <p className="mb-4"><strong>Total Amount:</strong> KSh {order.totalAmount.toLocaleString()}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {order.products.map((product) => (
                  <div key={product.id} className="bg-gray-800 p-4 rounded-lg">
                    <img
                      src={product.image || '/default-product.jpg'}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p>Qty: {product.quantity}</p>
                    <p>Price: KSh {product.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="mt-2">
                <label htmlFor={`status-${order._id}`} className="mr-2 font-medium">
                  Status:
                </label>
                <select
                  id={`status-${order._id}`}
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="bg-gray-700 text-white px-3 py-1 rounded"
                >
                  <option value="Packaging">Packaging</option>
                  <option value="InTransit">InTransit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
