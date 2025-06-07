import React, { useEffect, useState } from 'react';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setError('User not logged in.');
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `https://backend-5za1.onrender.com/api/orders/user/${userId}`
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Fetch user orders error:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      {loading ? (
        <p className="text-blue-400">Loading orders...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400">You have not placed any orders yet.</p>
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
              <span
                className={`${
                  order.status === 'Delivered'
                    ? 'text-green-400 font-bold'
                    : 'text-yellow-400'
                }`}
              >
                {order.status || 'Pending'}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-purple-400">Total:</span> KSh{' '}
              {order.totalAmount?.toLocaleString()}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {order.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-700 p-3 rounded shadow-md flex flex-col items-center"
                >
                  <img
                    src={product.image || '/fallback.jpg'}
                    alt={product.title || 'Product'}
                    className="w-24 h-24 object-cover rounded mb-2"
                  />
                  <div className="text-center">
                    <div className="font-semibold">{product.title || 'Unnamed Product'}</div>
                    <div>KSh {product.price?.toLocaleString() || '0'}</div>
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
