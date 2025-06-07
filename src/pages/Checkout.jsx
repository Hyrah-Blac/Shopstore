import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
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
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalPrice = getTotalPrice();
  const discountedPrice = totalPrice - (totalPrice * discount) / 100;

  const currentUser = {
    _id: localStorage.getItem("userId") || "",
    name,
    phone: phoneNumber,
    address,
    lat: userLocation.lat,
    lng: userLocation.lng,
  };

  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(coords);
      },
      () => {
        setLocationError("Unable to retrieve your location. Please allow location access.");
      }
    );
  }, []);

  // Reverse Geocode Address
  useEffect(() => {
    const { lat, lng } = userLocation;
    if (lat && lng) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.display_name) {
            setAddress(data.display_name);
          }
        })
        .catch(() => console.log("Reverse geocoding failed"));
    }
  }, [userLocation]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handlePromoCode = () => {
    if (promoCode.trim().toUpperCase() === "DRESSIN10") {
      setDiscount(10);
      setToast({ type: "success", message: "Promo code applied: 10% off!" });
    } else {
      setDiscount(0);
      setToast({ type: "error", message: "Invalid promo code." });
    }
  };

  const handlePayment = async () => {
    if (!name.trim() || !address.trim()) {
      setToast({ type: "error", message: "Please enter your name and address." });
      return;
    }
    if (!/^07\d{8}$/.test(phoneNumber)) {
      setToast({ type: "error", message: "Invalid Kenyan phone number. Start with 07." });
      return;
    }
    if (!userLocation.lat || !userLocation.lng) {
      setToast({ type: "error", message: "Location not available. Please allow access." });
      return;
    }
    if (!currentUser._id) {
      setToast({ type: "error", message: "User ID missing. Please log in again." });
      return;
    }

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
      setToast({ type: "error", message: err.message || "Failed to place order" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="checkout-container">
      <h1>Checkout</h1>

      {/* User Info */}
      <section className="user-info">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Phone Number (07XXXXXXXX)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          maxLength={10}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input-field"
        />
      </section>

      {/* Map */}
      {userLocation.lat && userLocation.lng && (
        <div className="map-preview mb-6 rounded-lg overflow-hidden">
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            style={{ height: "250px", borderRadius: "12px" }}
            scrollWheelZoom={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={markerIcon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  setUserLocation({ lat, lng });
                },
              }}
            />
          </MapContainer>
        </div>
      )}

      {/* Cart Items */}
      <section className="cart-preview">
        <h2>Your Items</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item, index) => (
            <article className="cart-item" key={index}>
              <img
                src={item.image?.startsWith("http") ? item.image : `/assets/${item.image?.replace(/^\//, "")}`}
                alt={item.name}
              />
              <div className="details">
                <p>{item.name}</p>
                <p>Price: KSh {Number(item.price).toLocaleString()}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Promo Code */}
      <section className="promo-code">
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="input-field"
        />
        <button onClick={handlePromoCode}>Apply</button>
      </section>

      {/* Totals */}
      <section className="order-summary">
        <p>
          Subtotal: <strong>KSh {totalPrice.toLocaleString()}</strong>
        </p>
        <p>
          Total after discount: <strong>KSh {discountedPrice.toLocaleString()}</strong>
        </p>
      </section>

      {/* Pay Button */}
      <button className="pay-btn" onClick={handlePayment} disabled={loading}>
        {loading ? (
          <span className="flex justify-center items-center gap-2">
            <span className="spinner"></span> Processing...
          </span>
        ) : (
          "Proceed to Pay"
        )}
      </button>

      {/* Toast */}
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      {locationError && <p className="error">{locationError}</p>}
    </main>
  );
};

export default Checkout;
