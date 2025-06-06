import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <ul>
        <li>
          <Link to="/add-product">➕ Add Product</Link>
        </li>
        <li>
          <Link to="/product-added">🛍️ View All Products</Link>
        </li>
        <li>
          <Link to="/delete-product">❌ Delete Product</Link>
        </li>
        <li>
          <Link to="/edit-product-prices">✏️ Edit Product Prices</Link>
        </li>
        <li>
          <Link to="/admin-orders">📦 Update Delivery Status</Link> {/* Fixed path */}
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
