import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import "./DeleteProduct.css";

const DeleteProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
        alert("❌ Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeletingId(id);
      await api.delete(`/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      alert("✅ Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error.message);
      alert("❌ Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="loading">Loading Products...</div>;

  return (
    <div className="delete-product-page">
      <h2 className="page-title">Delete Product</h2>
      <div className="product-list">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => {
            const imageUrl = product.imageUrl?.startsWith("http")
              ? product.imageUrl
              : `/assets/${product.imageUrl?.replace(/^\//, "")}`;

            return (
              <div key={product._id} className="product-card">
                <img
                  src={imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                  alt={product.name || "Product"}
                  className="product-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=Image+Error";
                  }}
                />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="price">Price: KSH {product.price}</p>
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
