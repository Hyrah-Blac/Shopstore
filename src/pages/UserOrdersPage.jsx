import React, { useEffect, useState } from 'react';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId'); // Make sure userId is stored correctly on login

  useEffect(() => {
    if (!userId) {
      setError('User not logged in.');
      setLoading(false);
      return;
    }

    fetch(`https://backend-5za1.onrender.com/api/orders/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch user orders error:', err);
        setError('Failed to load orders.');
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-800 p-4 mb-6 rounded-lg border border-gray-700 shadow-md"
          >
            <div className="mb-2">
              <span className="font-semibold text-purple-400">Order ID:</span>{' '}
              {order._id}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-purple-400">Status:</span>{' '}
              {order.status}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-purple-400">Total:</span> KSh{' '}
              {order.totalAmount.toLocaleString()}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
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

export default UserOrdersPage;
