import React, { useEffect, useState } from "react";
import "./ProductAdded.css";
import { API_URL, BACKEND_URL } from "../utils/api";

const ProductAdded = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Loading Products...</div>;

  return (
    <div className="product-list">
      <h2>All Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img
              src={`${BACKEND_URL}${product.imageUrl}`}
              alt={product.name}
              loading="lazy"
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/150?text=Image+Error")
              }
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>KSh {parseInt(product.price).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductAdded;
