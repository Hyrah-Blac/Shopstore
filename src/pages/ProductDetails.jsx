import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../utils/axiosConfig";
import { BACKEND_URL } from "../utils/api";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        if (response.data) {
          setProduct(response.data);
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Something went wrong. Please try again.");
      }
    };
    fetchProduct();
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.png";
    let cleanedPath = imagePath.trim().replace(/ /g, "%20").replace(/^\/+/, "");
    if (cleanedPath.startsWith("assets/assets/")) {
      cleanedPath = cleanedPath.replace("assets/assets/", "assets/");
    }
    if (/^https?:\/\//i.test(cleanedPath)) return cleanedPath;
    if (!cleanedPath.startsWith("assets/")) {
      cleanedPath = "assets/" + cleanedPath;
    }
    return `${BACKEND_URL}/${cleanedPath}`;
  };

  const handleAddToCart = () => {
    if (!product) return;

    const imageUrl = getImageUrl(product.imageUrl);
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: imageUrl,
    });

    toast.success("🛒 Added to Cart!", {
      position: "top-center",
      autoClose: 2000,
      transition: Slide,
    });
  };

  return (
    <div className="product-details">
      <ToastContainer />
      <div className="product-detail-container">
        {error ? (
          <div className="error-message">{error}</div>
        ) : product ? (
          <>
            <img
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.png";
              }}
              loading="lazy"
            />
            <div className="product-info">
              <h2>{product.name}</h2>
              <p><strong>Description:</strong> {product.description}</p>
              <p className="price"><strong>Price:</strong> KSh {parseInt(product.price).toLocaleString()}</p>
              <button className="add-to-cart-button" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </>
        ) : (
          <div className="skeleton-loader">
            <div className="skeleton-img" />
            <div className="skeleton-info">
              <div className="skeleton-line title"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
