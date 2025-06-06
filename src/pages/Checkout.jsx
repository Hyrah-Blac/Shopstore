import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");

  const totalPrice = getTotalPrice();
  const discountedPrice = totalPrice - (totalPrice * discount) / 100;

  const handlePayment = () => {
    if (!/^07\d{8}$/.test(phoneNumber)) {
      setError("Please enter a valid Kenyan phone number starting with 07");
      return;
    }

    alert(`Simulated Mpesa payment of KSh ${discountedPrice.toLocaleString()} from ${phoneNumber}`);
    clearCart();
    navigate("/home");
  };

  const handlePromoCode = () => {
    if (promoCode === "DRESSIN10") {
      setDiscount(10);
      setError("");
    } else {
      setDiscount(0);
      setError("Invalid promo code");
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

            <button className="pay-btn" onClick={handlePayment}>
              Pay Now with Mpesa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
