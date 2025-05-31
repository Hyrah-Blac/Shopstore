import React from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/api";

const ProductCard = ({ product }) => {
  // Ensure BACKEND_URL ends with slash
  const baseUrl = BACKEND_URL.endsWith("/") ? BACKEND_URL : BACKEND_URL + "/";

  // Clean image URL or fallback placeholder
  const imageUrl = product.imageUrl
    ? `${baseUrl}${product.imageUrl.replace(/^\/+/, "")}`
    : "/placeholder.png";

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite fallback loops
    e.target.src = "/placeholder.png";
  };

  // Parse price safely
  const priceNumber = parseInt(product.price, 10);
  const formattedPrice = isNaN(priceNumber)
    ? "N/A"
    : priceNumber.toLocaleString();

  return (
    <article
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
      aria-label={`Product: ${product.name}`}
    >
      <div
        className="relative w-full rounded-md overflow-hidden mb-4 shadow-sm"
        style={{ paddingTop: "75%", maxHeight: "240px" }}
      >
        <img
          src={imageUrl}
          alt={product.name || "Product image"}
          loading="lazy"
          onError={handleImageError}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-md transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="product-name text-lg font-semibold mb-2 flex-grow text-gray-900">
          {product.name || "Unnamed Product"}
        </h3>
        <p className="product-price text-indigo-600 font-semibold mb-4">
          KSh {formattedPrice}
        </p>
        <Link
          to={`/product-details/${product._id}`}
          className="mt-auto inline-block text-indigo-700 hover:text-indigo-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          aria-label={`View details of ${product.name}`}
        >
          View Details
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
