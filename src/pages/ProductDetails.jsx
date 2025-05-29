import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        const response = await axios.get(`https://backend-5za1.onrender.com/api/products/${id}`);
        if (response.data) {
          setProduct(response.data);
        } else {
          setError("Product not found!");
        }
      } catch (err) {
        console.error("Error fetching product details:", err.message);
        setError("Product not found!");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      const productData = {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image, // ✅ Keep as-is
      };
      addToCart(productData);

      toast.success("🛒 Item Added to Cart!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  if (loading) return <div className="loading">Loading Product...</div>;
  if (error) return <div className="error">{error}</div>;

  // ✅ Properly construct image URL
  const imageUrl = product.image
    ? `https://backend-5za1.onrender.com/assets/${product.image.replace(/^\/+/, "")}`
    : "https://via.placeholder.com/300x300?text=No+Image";

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
            e.target.src = "https://via.placeholder.com/300x300?text=Image+Error";
          }}
        />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p><strong>Description:</strong> {product.description}</p>
          <p className="price"><strong>Price:</strong> KSh {product.price}</p>
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
