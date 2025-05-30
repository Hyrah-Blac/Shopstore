// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/api"; // ✅ Import backend URL

const ProductCard = ({ product }) => {
  const imageUrl = product.imageUrl
    ? `${BACKEND_URL}${product.imageUrl}`
    : "/assets/placeholder.png"; // ✅ Use local placeholder

  const handleImageError = (e) => {
    console.warn("Image failed to load:", e.target.src);
    e.target.src = "/assets/placeholder.png"; // ✅ Local fallback
  };

  return (
    <div className="product-card w-full sm:w-auto">
      <img
        src={imageUrl}
        alt={product.name || "Product"}
        className="product-image"
        loading="lazy"
        onError={handleImageError}
      />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">
          KSh {parseInt(product.price).toLocaleString()}
        </p>
        <Link to={`/product-details/${product._id}`} className="product-details-link">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
6