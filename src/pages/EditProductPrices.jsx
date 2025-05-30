import React, { useState, useEffect } from "react";
import api from "../utils/axiosConfig";
import "./EditProductPrices.css";

const EditProductPrices = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error.message);
        alert("❌ Failed to load products.");
      }
    };

    fetchProducts();
  }, []);

  const handleUpdatePrice = async () => {
    if (!selectedProduct || !newPrice) {
      alert("⚠️ Please select a product and enter a new price.");
      return;
    }

    const priceNumber = parseFloat(newPrice);
    if (isNaN(priceNumber) || priceNumber < 0) {
      alert("⚠️ Enter a valid positive number for the price.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(`/products/${selectedProduct}`, { price: priceNumber });
      if (response.status === 200) {
        alert("✅ Product price updated successfully.");
        setProducts((prev) =>
          prev.map((product) =>
            product._id === selectedProduct ? { ...product, price: priceNumber } : product
          )
        );
        setSelectedProduct("");
        setNewPrice("");
      }
    } catch (error) {
      console.error("Error updating price:", error.message);
      alert("❌ Failed to update product price.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-product-prices">
      <h2 className="page-title">Edit Product Prices</h2>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="product-select"
            disabled={loading}
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            placeholder="Enter new price (KSH)"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="price-input"
            disabled={loading}
          />

          <button onClick={handleUpdatePrice} className="update-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Price"}
          </button>
        </>
      )}
    </div>
  );
};

export default EditProductPrices;
