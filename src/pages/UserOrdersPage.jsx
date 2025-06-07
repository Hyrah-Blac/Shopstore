import React, { useEffect, useState } from 'react';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser._id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetch(`https://backend-5za1.onrender.com/api/orders/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const filtered = data.filter((order) => order.status !== 'Delivered');
        setOrders(filtered);
      })
      .catch((err) => {
        console.error('Fetch user orders error:', err);
        setError('Could not load orders. Please try again.');
      });
  }, [userId]);

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {error ? (
        <p className="text-red-400">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400">No current orders (all delivered or none placed yet).</p>
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
              <span className="font-semibold text-purple-400">Status:</span>{' '}
              {order.status}
            </div>
            <div className="mb-4">
              <span className="font-semibold text-purple-400">Total:</span> KSh{' '}
              {order.totalAmount.toLocaleString()}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {order.products.map((product, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-3 rounded shadow-md flex flex-col items-center"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded mb-2"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-600 flex items-center justify-center rounded mb-2 text-sm text-gray-300">
                      No Image
                    </div>
                  )}
                  <div className="text-center">
                    <div className="font-semibold">{product.name}</div>
                    <div>KSh {(product.price * product.quantity).toLocaleString()}</div>
                    <div className="text-sm text-gray-300">Qty: {product.quantity}</div>
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
