import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditProductPrices.css"; // You can add styles here or keep inline

const EditProductPrices = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error.message);
        alert("❌ Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  const handleUpdatePrice = async () => {
    if (!selectedProduct || !newPrice) {
      alert("⚠️ Please select a product and enter a new price.");
      return;
    }

    try {
      const response = await axios.put(`/api/products/${selectedProduct}`, {
        price: newPrice,
      });

      if (response.status === 200) {
        alert("✅ Product price updated successfully.");
        setNewPrice("");
        setSelectedProduct("");
      }
    } catch (error) {
      console.error("Error updating product price:", error.message);
      alert("❌ Failed to update product price.");
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
          />

          <button onClick={handleUpdatePrice} className="update-btn">
            Update Price
          </button>
        </>
      )}
    </div>
  );
};

export default EditProductPrices;