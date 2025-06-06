import React from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/api";

const ProductCard = ({ product }) => {
  // Ensure product.imageUrl has a leading slash for correct URL concat
  const imageUrl = product.imageUrl
    ? `${BACKEND_URL}${product.imageUrl.startsWith("/") ? "" : "/"}${product.imageUrl}`
    : "/placeholder.png";

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/placeholder.png";
  };

  // Parse price safely
  const priceNumber = parseInt(product.price);
  const formattedPrice = isNaN(priceNumber) ? "N/A" : priceNumber.toLocaleString();

  return (
    <div className="product-card">
      <img
        src={imageUrl}
        alt={product.name || "Product"}
        loading="lazy"
        onError={handleImageError}
        className="product-image"
      />
      <div className="flex flex-col flex-grow">
        <h3 className="product-name">{product.name || "Unnamed Product"}</h3>
        <p className="product-price">KSh {formattedPrice}</p>
        <Link
          to={`/product-details/${product._id}`}
          className="product-details-link"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
