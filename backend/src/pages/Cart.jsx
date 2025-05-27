import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const { cartItems = [], removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="empty-cart-message">
          Your cart is empty.{" "}
          <Link to="/home" className="continue-shopping-link">
            Continue Shopping
          </Link>
        </p>
      ) : (
        <>
          <div className="cart-items-grid">
            {cartItems.map((item, index) => {
              const imageUrl = item.image
                ? item.image.startsWith("http")
                  ? item.image
                  : `/assets/${item.image.replace(/^\//, "")}`
                : "https://via.placeholder.com/150?text=No+Image ";

              return (
                <div key={`${item.id}-${index}`} className="cart-item-card">
                  <img
                    src={imageUrl}
                    alt={item.name || "Product"}
                    className="cart-item-image"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/150?text=Image+Error ")
                    }
                  />
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">
                      {item.name || "Unnamed Product"}
                    </h3>
                    <p className="cart-item-price">
                      Price: KSh {parseInt(item.price || 0).toLocaleString()}
                    </p>
                    <p>Quantity: {item.quantity || 1}</p>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3 className="cart-total">
              Total: KSh {parseFloat(getTotalPrice()).toLocaleString()}
            </h3>
            <button
              className="checkout-button"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;