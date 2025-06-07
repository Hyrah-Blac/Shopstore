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

  // Example: assume currentUser object is fetched or passed from context/global state
  // Must include _id (string), e.g. from user auth
  const currentUser = {
    _id: localStorage.getItem("userId") || "", // or from auth context
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

    if (!currentUser._id) {
      setError("User ID missing. Please login.");
      return;
    }

    setError("");
    setLoading(true);

    const orderData = {
      user: currentUser, // include _id here!
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
      alert(
        `Simulated Mpesa payment of KSh ${discountedPrice.toLocaleString()} from ${phoneNumber}`
      );

      const res = await fetch("https://backend-5za1.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      const data = await res.json();

      clearCart();

      navigate(`/user-delivery-status/${data.orderId}`);
    } catch (err) {
      setError(err.message || "Failed to place order");
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="user-info">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number (e.g., 07XXXXXXXX)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          maxLength={10}
        />
        <input
          type="text"
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <div className="promo-code">
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button onClick={handlePromoCode}>Apply</button>
        {discount > 0 && <p>Promo code applied: {discount}% off</p>}
      </div>

      <div className="order-summary">
        <p>Subtotal: KSh {totalPrice.toLocaleString()}</p>
        <p>
          Total after discount: KSh {discountedPrice.toLocaleString()}
        </p>
      </div>

      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing Payment..." : "Proceed to Pay"}
      </button>

      {error && <p className="error">{error}</p>}
      {locationError && <p className="error">{locationError}</p>}
    </div>
  );
};

export default Checkout;
