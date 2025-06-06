import React, { useEffect, useState } from 'react';
import './UserDeliveryStatus.css';

const UserDeliveryStatus = () => {
  const [orders, setOrders] = useState([]);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('https://backend-5za1.onrender.com/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const fetchOrdersByPhone = () => {
    if (!phone) return;
    setLoading(true);
    fetch(`https://backend-5za1.onrender.com/api/orders/user/${phone}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-white">
        Delivery Status
      </h1>

      {/* Phone input */}
      <div className="mb-8 flex flex-wrap gap-4 items-center">
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-grow max-w-xs px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={fetchOrdersByPhone}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Check Status
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-700 dark:text-gray-300">Loading...</p>
      ) : orders.length > 0 ? (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Order ID: {order._id}
                </h2>
                <p className="text-indigo-600 font-semibold mt-2 md:mt-0">
                  Status: <span className="capitalize">{order.status}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {order.products?.map(({ product, quantity, price }, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Quantity: {quantity}
                      </p>
                      <p className="text-indigo-600 font-bold">
                        KSh {(price * quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-right font-semibold text-gray-900 dark:text-white text-lg">
                Total: KSh {order.totalAmount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700 dark:text-gray-300 text-lg">
          No orders found.
        </p>
      )}
    </div>
  );
};

export default UserDeliveryStatus;
