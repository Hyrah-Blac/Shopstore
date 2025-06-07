import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = {
    _id: localStorage.getItem("userId") || "",
    name,
    phone: phoneNumber,
    address,
    lat: userLocation.lat,
    lng: userLocation.lng,
  };

  const totalPrice = getTotalPrice();
  const discountedPrice = totalPrice - (totalPrice * discount) / 100;

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setLocationError("Unable to retrieve your location. Please allow location access.");
      }
    );
  }, []);

  const handlePromoCode = () => {
    if (promoCode.trim().toUpperCase() === "DRESSIN10") {
      setDiscount(10);
      setError("");
    } else {
      setDiscount(0);
      setError("Invalid promo code");
    }
  };

  const handlePayment = async () => {
    if (!name.trim() || !address.trim()) {
      setError("Please enter your name and address.");
      return;
    }
    if (!/^07\d{8}$/.test(phoneNumber)) {
      setError("Please enter a valid Kenyan phone number starting with 07");
      return;
    }
    if (!userLocation.lat || !userLocation.lng) {
      setError("Cannot get your location. Please allow location access.");
      return;
    }
    if (!currentUser._id) {
      setError("User ID missing. Please login.");
      return;
    }

    setError("");
    setLoading(true);

    const orderData = {
      user: currentUser,
      products: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image?.startsWith("http")
          ? item.image
          : `/assets/${item.image?.replace(/^\//, "") || "placeholder.png"}`,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
      totalAmount: discountedPrice,
      status: "Packaging",
      createdAt: new Date().toISOString(),
    };

    try {
      alert(`Simulated Mpesa payment of KSh ${discountedPrice.toLocaleString()} from ${phoneNumber}`);
      const res = await fetch("https://backend-5za1.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to place order");

      const data = await res.json();
      clearCart();
      navigate(`/user-delivery-status/${data.orderId}`);
    } catch (err) {
      setError(err.message || "Failed to place order");
      setLoading(false);
    }
  };

  return (
    <main className="checkout-container max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 border-b pb-2">Checkout</h1>

      <section className="user-info mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
          aria-label="Name"
        />
        <input
          type="text"
          placeholder="Phone Number (e.g., 07XXXXXXXX)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          maxLength={10}
          className="input-field"
          aria-label="Phone Number"
        />
        <input
          type="text"
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input-field col-span-1 md:col-span-3"
          aria-label="Delivery Address"
        />
      </section>

      <section className="cart-preview mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Items</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-4 max-h-80 overflow-auto">
            {cartItems.map((item, index) => (
              <article
                className="cart-item flex items-center gap-4 bg-gray-800 p-4 rounded-md shadow-md"
                key={index}
              >
                <img
                  src={item.image?.startsWith("http") ? item.image : `/assets/${item.image?.replace(/^\//, "")}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                  loading="lazy"
                />
                <div className="details flex flex-col justify-center">
                  <p className="font-semibold text-lg">{item.name}</p>
                  <p>Price: KSh {Number(item.price).toLocaleString()}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="promo-code mb-6 flex gap-3 items-center">
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="input-field flex-grow"
          aria-label="Promo code"
        />
        <button
          onClick={handlePromoCode}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
          aria-label="Apply promo code"
        >
          Apply
        </button>
      </section>
      {discount > 0 && <p className="text-green-400 mb-4">Promo code applied: {discount}% off</p>}

      <section className="order-summary mb-6 text-lg">
        <p>
          Subtotal: <strong>KSh {totalPrice.toLocaleString()}</strong>
        </p>
        <p>
          Total after discount: <strong>KSh {discountedPrice.toLocaleString()}</strong>
        </p>
      </section>

      <button
        className="pay-btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded w-full disabled:opacity-50 disabled:cursor-not-allowed transition"
        onClick={handlePayment}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Processing Payment..." : "Proceed to Pay"}
      </button>

      {(error || locationError) && (
        <p className="error mt-4 text-red-500 font-semibold" role="alert">
          {error || locationError}
        </p>
      )}
    </main>
  );
};

export default Checkout;
