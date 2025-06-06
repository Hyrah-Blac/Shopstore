import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/api";
import "./Cart.css";

const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder.png";
  let cleanedPath = imagePath.trim().replace(/ /g, "%20").replace(/^\/+/, "");
  if (cleanedPath.startsWith("assets/assets/")) {
    cleanedPath = cleanedPath.replace("assets/assets/", "assets/");
  }
  if (/^https?:\/\//i.test(cleanedPath)) return cleanedPath;
  if (!cleanedPath.startsWith("assets/")) cleanedPath = "assets/" + cleanedPath;
  return `${BACKEND_URL}/${cleanedPath}`;
};

const Cart = () => {
  const {
    cartItems = [],
    removeFromCart,
    getTotalPrice,
    updateCartItemQuantity,
  } = useCart();
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
              const imageUrl = getImageUrl(item.image);
              const priceNumber = Number(item.price);
              const formattedPrice = isNaN(priceNumber)
                ? "N/A"
                : priceNumber.toLocaleString();
              const quantity = item.quantity > 0 ? Number(item.quantity) : 1;

              return (
                <div key={`${item.id}-${index}`} className="cart-item-card">
                  <img
                    src={imageUrl}
                    alt={item.name || "Product"}
                    className="cart-item-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.name || "Unnamed Product"}</h3>
                    <p className="cart-item-price">Price: KSh {formattedPrice}</p>

                    <label htmlFor={`quantity-${index}`} className="cart-item-qty">
                      Qty:
                      <select
                        id={`quantity-${index}`}
                        value={quantity}
                        onChange={(e) =>
                          updateCartItemQuantity(item.id, Number(e.target.value))
                        }
                        className="quantity-select"
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </label>

                    <button
                      className="delete-icon-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Delete ${item.name || "product"} from cart`}
                      title="Remove item"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trash"
                        height="20"
                        width="20"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3 className="cart-total">
              Total: KSh {Number(getTotalPrice()).toLocaleString()}
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
