import React, { useEffect, useState } from 'react';

const STATUS_STEPS = ['Packaging', 'In Transit', 'Delivered'];

// Normalize both status and step for consistent comparison
const normalize = (text) => text?.toLowerCase().replace(/\s+/g, '').trim();

const getStatusIndex = (status) => {
  const idx = STATUS_STEPS.findIndex(
    (step) => normalize(step) === normalize(status)
  );
  return idx === -1 ? 0 : idx;
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
    <main className="main-content px-4 py-10 text-[var(--text-color-light)] font-poppins">
      <h1 className="text-3xl font-bold mb-10 text-center text-[var(--neon-color)] neon-text">
        Your Orders
      </h1>

      {loading ? (
        <p className="text-center neon-pulse text-[var(--neon-color)] text-sm">
          Loading orders...
        </p>
      ) : error ? (
        <p className="text-center text-red-400 text-sm">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-400 text-sm">
          You have not placed any orders yet.
        </p>
      ) : (
        <div className="w-full max-w-6xl mx-auto space-y-10">
          {orders.map((order) => {
            const currentStep = getStatusIndex(order.status);

            return (
              <section
                key={order._id}
                className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 backdrop-blur-lg shadow-lg hover:shadow-[0_0_30px_var(--neon-color)] transition-shadow duration-300"
              >
                <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-2">
                  <p className="font-semibold text-sm text-[var(--neon-color)] tracking-wide break-all">
                    Order ID: <span className="font-mono text-indigo-400">{order._id}</span>
                  </p>
                  <p className="font-semibold text-sm text-indigo-400">
                    Total: KSh {order.totalAmount?.toLocaleString()}
                  </p>
                </header>

                {/* Progress Bar */}
                <div className="relative flex justify-between items-center max-w-xl mx-auto mb-8 px-4">
                  {STATUS_STEPS.map((step, idx) => (
                    <div key={step} className="flex flex-col items-center w-1/3 relative z-10">
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          idx <= currentStep
                            ? 'bg-[var(--neon-color)] border-[var(--neon-color)] shadow-[0_0_10px_var(--neon-color)]'
                            : 'bg-gray-600 border-gray-500'
                        } transition-all duration-300`}
                      ></div>
                      <span
                        className={`mt-1 text-[10px] font-medium text-center ${
                          idx <= currentStep ? 'text-[var(--neon-color)]' : 'text-gray-500'
                        }`}
                      >
                        {step}
                      </span>
                      {idx < STATUS_STEPS.length - 1 && (
                        <div
                          className={`absolute top-[10px] left-1/2 right-[-50%] h-1 ${
                            idx < currentStep
                              ? 'bg-[var(--neon-color)] shadow-[0_0_6px_var(--neon-color)]'
                              : 'bg-gray-700'
                          }`}
                          style={{ width: '100%', transform: 'translateX(50%)' }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {order.products.map((product) => (
                    <div
                      key={product.id || product._id}
                      className="product-card cursor-default"
                      title={product.title}
                    >
                      <img
                        src={product.image || '/fallback.jpg'}
                        alt={product.title || 'Product Image'}
                        className="product-image"
                      />
                      <div className="p-2 text-center">
                        <h3 className="font-semibold text-sm truncate">{product.title || 'Product'}</h3>
                        <p className="font-mono text-indigo-400 text-xs">
                          KSh {product.price?.toLocaleString() || '0'}
                        </p>
                        <p className="text-gray-400 text-xs">Qty: {product.quantity || 1}</p>
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
