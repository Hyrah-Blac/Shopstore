import React, { useEffect, useState } from 'react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://backend-5za1.onrender.com/api/orders')
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch((err) => {
        console.error('Fetch orders error:', err);
        setError('Could not load orders.');
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
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Orders</h1>
      {error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-800 p-4 mb-6 rounded-lg shadow-lg border border-gray-700"
          >
            <div className="mb-2">
              <span className="font-semibold text-purple-400">Order ID:</span>{' '}
              {order._id}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-purple-400">User:</span>{' '}
              {order.user?.name}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-purple-400">Address:</span>{' '}
              {order.user?.address}
            </div>
            <div className="mb-4">
              <span className="font-semibold text-purple-400">Total:</span> KSh{' '}
              {order.totalAmount.toLocaleString()}
            </div>

            <div className="mb-4">
              <label className="font-semibold text-purple-400">Status:</label>{' '}
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="ml-2 px-3 py-1 rounded bg-gray-700 text-white border border-gray-500"
              >
                <option value="Packaging">Packaging</option>
                <option value="InTransit">InTransit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {order.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-700 p-3 rounded shadow-md flex flex-col items-center"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded mb-2"
                  />
                  <div className="text-center">
                    <div className="font-semibold">{product.title}</div>
                    <div>KSh {product.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
