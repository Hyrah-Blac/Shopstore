import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBoxOpen, FaTruck, FaCheckCircle } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { useWindowSize } from "react-use";

const STATUS_STEPS = ['Packaging', 'In Transit', 'Delivered'];

const normalize = (text) => text?.toLowerCase().replace(/\s+/g, '').trim();

const getStatusIndex = (status) => {
  const idx = STATUS_STEPS.findIndex(
    (step) => normalize(step) === normalize(status)
  );
  return idx === -1 ? 0 : idx;
};

const statusIcons = {
  Packaging: <FaBoxOpen className="text-xl" />,
  'In Transit': <FaTruck className="text-xl" />,
  Delivered: <FaCheckCircle className="text-xl" />,
};

const deliveredMessageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: 'spring', stiffness: 260, damping: 20 
    }
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } },
};

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track which order IDs should show confetti
  const [confettiActiveOrders, setConfettiActiveOrders] = useState(new Set());

  const userId = localStorage.getItem('userId');

  const { width, height } = useWindowSize();

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

        // Initialize confetti for delivered orders
        const deliveredOrders = data.filter(
          (o) => normalize(o.status) === 'delivered'
        );
        setConfettiActiveOrders(new Set(deliveredOrders.map((o) => o._id)));

        // Automatically stop confetti after 8 seconds per delivered order
        deliveredOrders.forEach((order) => {
          setTimeout(() => {
            setConfettiActiveOrders((prev) => {
              const newSet = new Set(prev);
              newSet.delete(order._id);
              return newSet;
            });
          }, 8000);
        });
      } catch (err) {
        setError('You currently have no orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <main className="main-content px-4 py-10 text-[var(--text-color-light)] font-poppins relative">
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
            const isDelivered = normalize(order.status) === 'delivered';
            const confettiActive = confettiActiveOrders.has(order._id);

            return (
              <section
                key={order._id}
                className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 backdrop-blur-lg shadow-lg hover:shadow-[0_0_30px_var(--neon-color)] transition-shadow duration-300 relative"
              >
                {/* Confetti only when active */}
                <AnimatePresence>
                  {confettiActive && (
                    <motion.div
                      key="confetti"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 1 } }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 50,
                      }}
                    >
                      <Confetti
                        width={width}
                        height={height}
                        recycle={true}
                        numberOfPieces={150}
                        gravity={0.3}
                        colors={['#22c55e', '#10b981', '#059669', '#047857']}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-2">
                  <p className="font-semibold text-sm text-[var(--neon-color)] tracking-wide break-all">
                    Order ID: <span className="font-mono text-indigo-400">{order._id}</span>
                  </p>
                  <p className="font-semibold text-sm text-indigo-400">
                    Total: KSh {order.totalAmount?.toLocaleString()}
                  </p>
                </header>

                {/* Delivered Message with fade-out */}
                <AnimatePresence>
                  {isDelivered && (
                    <motion.div
                      className="mb-6 p-6 rounded-xl bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white shadow-lg shadow-green-600/50 flex items-center justify-center gap-4 text-center font-semibold text-lg neon-text select-none"
                      variants={deliveredMessageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <FaCheckCircle className="text-4xl" />
                      <span>🎉 Congratulations! Your order has been <strong>delivered</strong>! Enjoy your purchase! 🎉</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Animated Progress Bar */}
                <div className="relative flex justify-between items-center max-w-xl mx-auto mb-8 px-4">
                  {STATUS_STEPS.map((step, idx) => (
                    <div key={step} className="flex flex-col items-center w-1/3 relative z-10">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={order._id + step}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-white ${
                            idx <= currentStep
                              ? 'bg-green-500 border-green-500 shadow-[0_0_10px_#22c55e]'
                              : 'bg-gray-600 border-gray-500'
                          }`}
                        >
                          {statusIcons[step]}
                        </motion.div>
                      </AnimatePresence>
                      <span
                        className={`mt-1 text-[10px] font-medium text-center ${
                          idx <= currentStep ? 'text-green-400' : 'text-gray-500'
                        }`}
                      >
                        {step}
                      </span>
                      {idx < STATUS_STEPS.length - 1 && (
                        <div
                          className={`absolute top-[12px] left-1/2 right-[-50%] h-1 ${
                            idx < currentStep
                              ? 'bg-green-500 shadow-[0_0_6px_#22c55e]'
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
                          KSh {product.price?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* User address */}
                <address className="mt-6 p-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-xs font-mono leading-relaxed whitespace-pre-line select-text">
                  {order.address || 'No address provided'}
                </address>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default UserOrdersPage;
