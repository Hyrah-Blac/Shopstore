import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../utils/axiosConfig";
import { BACKEND_URL } from "../utils/api";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        if (response.data) {
          setProduct(response.data);
        } else {
          setError("Product not found!");
        }
      } catch (err) {
        console.error("Error fetching product details:", err.message);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      });

      toast.success("🛒 Item Added to Cart!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  // Use your local fallback image in public folder
  const imageUrl = product?.image
    ? `${BACKEND_URL}/assets/${product.image.replace(/^\/+/, "")}`
    : "/placeholder.png";

  if (loading) {
    return <div className="product-details loading">Loading product...</div>;
  }

  if (error) {
    return <div className="product-details error-message">{error}</div>;
  }

  return (
    <div className="product-details">
      <ToastContainer />
      <div className="product-detail-container">
        <img
          src={imageUrl}
          alt={product.name || "Product"}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder.png"; // fallback on error
          }}
        />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p><strong>Description:</strong> {product.description}</p>
          <p className="price">
            <strong>Price:</strong> KSh {parseInt(product.price).toLocaleString()}
          </p>
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
