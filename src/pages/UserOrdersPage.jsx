import React, { useEffect, useState } from 'react';

const STATUS_STEPS = ['Packaging', 'In Transit', 'Delivered'];

const normalize = (text) => text?.toLowerCase().replace(/\s+/g, '').trim();

const getStatusIndex = (status) => {
  const idx = STATUS_STEPS.findIndex((step) => normalize(step) === normalize(status));
  return idx === -1 ? 0 : idx;
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toDateString();
};

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
        const res = await fetch(`https://backend-5za1.onrender.com/api/orders/user/${userId}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError('You currently have no orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <main className="main-content px-4 py-10 font-poppins text-[var(--text-color-light)]">
      <h1 className="text-4xl font-bold text-center mb-10 neon-text text-[var(--neon-color)]">
        Your Orders
      </h1>

      {loading ? (
        <p className="text-center text-sm neon-pulse text-[var(--neon-color)]">Loading orders...</p>
      ) : error ? (
        <p className="text-center text-sm text-red-400">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-sm text-gray-400">
          You have not placed any orders yet.
        </p>
      ) : (
        <div className="max-w-6xl mx-auto space-y-12">
          {orders.map((order) => {
            const currentStep = getStatusIndex(order.status);
            const createdDate = new Date(order.createdAt || Date.now());
            const estDelivery = addDays(createdDate, 5);

            return (
              <section
                key={order._id}
                className="bg-[var(--glass-bg)] border border-[var(--glass-border)] p-6 rounded-2xl backdrop-blur-lg shadow-lg hover:shadow-[0_0_30px_var(--neon-color)] transition-all duration-300"
              >
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                  <p className="text-sm font-semibold text-[var(--neon-color)] tracking-wide break-all">
                    Order ID: <span className="font-mono text-indigo-400">{order._id}</span>
                  </p>
                  <p className="text-sm font-semibold text-indigo-400">
                    Total: KSh {order.totalAmount?.toLocaleString()}
                  </p>
                </header>

                {/* Progress Bar with Tooltip + Animation */}
                <div className="uds-progress-bar">
                  {STATUS_STEPS.map((step, idx) => (
                    <div key={step} className="uds-progress-step group">
                      <div
                        className={`uds-circle transition-transform duration-500 ${
                          idx <= currentStep ? 'active scale-110' : ''
                        }`}
                        title={`Step ${idx + 1}: ${step}`}
                      ></div>
                      <div className={`uds-label ${idx <= currentStep ? 'active' : ''}`}>
                        {step}
                      </div>
                      {idx < STATUS_STEPS.length - 1 && (
                        <div className={`uds-line ${idx < currentStep ? 'active' : ''}`} />
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-center text-gray-400 mt-2">
                  Estimated Delivery: <span className="text-white font-medium">{estDelivery}</span>
                </p>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                  {order.products.map((product) => (
                    <div
                      key={product.id || product._id}
                      className="bg-[#111111aa] border border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-[0_0_15px_var(--neon-color)] transition-all duration-300"
                    >
                      <img
                        src={product.image || '/fallback.jpg'}
                        alt={product.title || 'Product Image'}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3 text-center">
                        <h3 className="text-sm font-semibold text-white truncate">
                          {product.title || 'Product'}
                        </h3>
                        <p className="text-indigo-400 font-mono text-xs mt-1">
                          KSh {product.price?.toLocaleString() || '0'}
                        </p>
                        <p className="text-xs text-gray-400">Qty: {product.quantity || 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default UserOrdersPage;
