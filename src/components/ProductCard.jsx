// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const imageUrl = product.imageUrl
    ? `${window.location.origin}${product.imageUrl.startsWith("/") ? "" : "/"}${product.imageUrl}`
    : "https://via.placeholder.com/300x200?text=No+Image+Available ";

  return (
    <div className="product-card w-full sm:w-auto">
      <img
        src={imageUrl}
        alt={product.name || "Product"}
        className="product-image"
        loading="lazy"
      />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">KSh {(product.price / 100).toFixed(2)}</p>
        <Link to={`/product-details/${product._id}`} className="product-details-link">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;