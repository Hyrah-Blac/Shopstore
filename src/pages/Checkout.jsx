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
        setLocationError("Unable to retrieve your location.");
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

    setError("");
    setLoading(true);

    const orderData = {
      user: {
        name,
        phone: phoneNumber,
        address,
        lat: userLocation.lat,
        lng: userLocation.lng,
      },
      products: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        image:
          item.image && !item.image.startsWith("http")
            ? `/assets/${item.image.replace(/^\//, "")}`
            : item.image || "/placeholder.png",
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

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to place order");
      }

      const data = await res.json();
      clearCart();

      // Navigate to delivery status page with returned order ID
      navigate(`/user-delivery-status/${data.order._id}`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty. Go back to <strong>Home</strong> and add items.</p>
      ) : (
        <div className="checkout-container">
          <div className="checkout-items">
            <h2>Items in Cart</h2>
            <ul>
              {cartItems.map((item, index) => {
                const imageUrl =
                  item.image && !item.image.startsWith("http")
                    ? `/assets/${item.image.replace(/^\//, "")}`
                    : item.image || "/placeholder.png";

                return (
                  <li key={`${item.id}-${index}`} className="checkout-item">
                    <img
                      src={imageUrl}
                      alt={item.name || "Product"}
                      className="checkout-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.png";
                      }}
                    />
                    <div className="checkout-details">
                      <p><strong>{item.name || "Unnamed Product"}</strong></p>
                      <p>Price: KSh {parseInt(item.price || 0).toLocaleString()}</p>
                      <p>Qty: {item.quantity || 1}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="payment-form">
            <h2>Delivery Details</h2>

            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              placeholder="Delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <label>Your Location:</label>
            {userLocation.lat && userLocation.lng ? (
              <p>Lat: {userLocation.lat?.toFixed(5)}, Lng: {userLocation.lng?.toFixed(5)}</p>
            ) : (
              <p>{locationError || "Fetching location..."}</p>
            )}

            <h2>Mpesa Payment</h2>

            <label htmlFor="phone">Mpesa Number:</label>
            <input
              type="tel"
              id="phone"
              placeholder="07XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />

            <label htmlFor="promo">Promo Code (optional):</label>
            <div className="promo-row">
              <input
                type="text"
                id="promo"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button type="button" className="apply-btn" onClick={handlePromoCode}>
                Apply
              </button>
            </div>

            <div className="total-section">
              <p>Subtotal: <strong>KSh {totalPrice.toLocaleString()}</strong></p>
              {discount > 0 && <p>Discount: <strong>{discount}%</strong></p>}
              <p className="grand-total">
                Total: <strong>KSh {discountedPrice.toLocaleString()}</strong>
              </p>
            </div>

            {error && <div className="checkout-error">{error}</div>}

            <button className="pay-btn" onClick={handlePayment} disabled={loading}>
              {loading ? "Processing..." : "Pay Now with Mpesa"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
