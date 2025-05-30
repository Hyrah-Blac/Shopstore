import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig"; // Use your axios instance
import "./DeleteProduct.css";

const DeleteProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setMessage("");
      try {
        const response = await api.get("/products"); // assuming api is configured with baseURL
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
        setMessage("❌ Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setMessage("");
    setDeletingId(id);

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
      setMessage("✅ Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error.message);
      setMessage("❌ Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading Products...</div>;
  }

  return (
    <div className="delete-product-page">
      <h2 className="page-title">Delete Product</h2>
      {message && <p className="form-message">{message}</p>}
      <div className="product-list">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => {
            // Normalize image URL logic (handle relative and absolute URLs)
            const imageUrl = product.imageUrl
              ? product.imageUrl.startsWith("http")
                ? product.imageUrl
                : `/assets/${product.imageUrl.replace(/^\//, "")}`
              : "https://via.placeholder.com/300x200?text=No+Image";

            return (
              <div key={product._id} className="product-card">
                <img
                  src={imageUrl}
                  alt={product.name || "Product"}
                  className="product-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200?text=Image+Error";
                  }}
                />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="price">Price: KSH {product.price.toLocaleString()}</p>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="delete-button"
                    disabled={deletingId === product._id}
                  >
                    {deletingId === product._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DeleteProduct;
