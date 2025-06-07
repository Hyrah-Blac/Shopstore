import React, { useEffect, useState } from 'react';

const STATUS_STEPS = ['Packaging', 'In Transit', 'Shipped', 'Delivered'];

const getStatusIndex = (status) => {
  const idx = STATUS_STEPS.findIndex(
    (step) => step.toLowerCase() === status?.toLowerCase()
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
    <main className="main-content">
      <h1>Your Orders</h1>

      {loading ? (
        <p className="text-center neon-pulse" style={{color: 'var(--neon-color)'}}>
          Loading orders...
        </p>
      ) : error ? (
        <p className="text-center" style={{ color: 'tomato' }}>{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center" style={{ color: 'var(--text-color-light)' }}>
          You have not placed any orders yet.
        </p>
      ) : (
        <div className="w-full max-w-6xl mx-auto space-y-8">
          {orders.map((order) => {
            const currentStep = getStatusIndex(order.status);

            return (
              <section
                key={order._id}
                className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 backdrop-blur-lg shadow-lg hover:shadow-[0_0_30px_var(--neon-color)] transition-shadow duration-300"
              >
                <header className="flex flex-col md:flex-row justify-between items-center mb-6">
                  <p className="font-semibold text-lg text-[var(--neon-color)] tracking-wide break-all">
                    Order ID: <span className="font-mono text-indigo-400">{order._id}</span>
                  </p>
                  <p className="font-semibold text-lg text-indigo-400 mt-3 md:mt-0">
                    Total: KSh {order.totalAmount?.toLocaleString()}
                  </p>
                </header>

                {/* Status Progress Bar */}
                <div className="relative flex justify-between items-center max-w-xl mx-auto mb-6 px-4">
                  {STATUS_STEPS.map((step, idx) => (
                    <div key={step} className="flex flex-col items-center w-1/4 relative z-10">
                      <div
                        className={`status-circle ${
                          idx <= currentStep ? 'active' : ''
                        }`}
                        aria-label={step}
                      >
                        {idx + 1}
                      </div>
                      <span
                        className={`mt-2 text-xs font-semibold ${
                          idx <= currentStep ? 'text-[var(--neon-color)]' : 'text-gray-500'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  ))}

                  {/* Line behind circles */}
                  <div className="absolute top-5 left-[12%] right-[12%] h-1 rounded-full bg-gray-700">
                    <div
                      className="h-1 rounded-full bg-[var(--neon-color)] transition-[width] duration-700 ease-in-out"
                      style={{
                        width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%`,
                      }}
                    />
                  </div>
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
