// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/api"; // ✅ Import backend URL

const ProductCard = ({ product }) => {
  const imageUrl = product.imageUrl
    ? `${BACKEND_URL}${product.imageUrl}`
    : "https://via.placeholder.com/300x200?text=No+Image+Available";

  return (
    <div className="product-card w-full sm:w-auto">
      <img
        src={imageUrl}
        alt={product.name || "Product"}
        className="product-image"
        loading="lazy"
        onError={(e) =>
          (e.target.src = "https://via.placeholder.com/300x200?text=Image+Error")
        }
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
