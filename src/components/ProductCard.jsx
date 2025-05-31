import React from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/api";

const ProductCard = ({ product }) => {
  // Ensure BACKEND_URL ends with a slash to avoid URL errors
  const baseUrl = BACKEND_URL.endsWith("/") ? BACKEND_URL : BACKEND_URL + "/";
  const imageUrl = product.imageUrl
    ? `${baseUrl}${product.imageUrl.replace(/^\/+/, "")}`  // remove leading slash if present
    : "/placeholder.png";

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/placeholder.png";
  };

  return (
    <div
      className="
        flex flex-col bg-white rounded-lg p-4
        shadow-md
        hover:shadow-[0_0_15px_5px_#8a2be2,0_0_30px_10px_#7209b7]
        transition-shadow duration-300
        min-h-[400px]
      "
    >
      <img
        src={imageUrl}
        alt={product.name || "Product"}
        loading="lazy"
        onError={handleImageError}
        className="h-48 w-full object-cover rounded-md mb-4 flex-shrink-0"
      />
      <div className="flex flex-col flex-grow">
        <h3 className="product-name text-lg font-semibold mb-2 flex-grow">
          {product.name}
        </h3>
        <p className="product-price text-indigo-600 font-semibold mb-4">
          KSh {parseInt(product.price, 10).toLocaleString()}
        </p>
        <Link
          to={`/product-details/${product._id}`}
          className="mt-auto inline-block text-indigo-700 hover:text-indigo-900 font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
