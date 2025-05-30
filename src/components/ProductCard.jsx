import React from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/api";

const ProductCard = ({ product }) => {
  const imageUrl = product.imageUrl
    ? `${BACKEND_URL}${product.imageUrl}`
    : "/placeholder.png"; // ✅ Correct local reference

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = "/placeholder.png"; // ✅ Use local public placeholder
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
