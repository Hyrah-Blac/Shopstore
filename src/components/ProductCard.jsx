import React from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/api";

const ProductCard = ({ product }) => {
  const baseUrl = BACKEND_URL.endsWith("/") ? BACKEND_URL : BACKEND_URL + "/";
  const imageUrl = product.imageUrl
    ? `${baseUrl}${product.imageUrl.replace(/^\/+/, "")}`
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
        max-w-[280px]
        w-full
        mx-auto
      "
    >
      <div
        className="relative w-full rounded-md overflow-hidden mb-4 shadow-sm"
        style={{ paddingTop: "75%", maxHeight: "240px" }}
      >
        <img
          src={imageUrl}
          alt={product.name || "Product"}
          loading="lazy"
          onError={handleImageError}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105 rounded-md"
        />
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="product-name text-lg font-semibold mb-2 flex-grow text-gray-900">
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
