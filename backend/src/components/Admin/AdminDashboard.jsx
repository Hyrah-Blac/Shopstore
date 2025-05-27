// src/components/Admin/AdminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-5">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-5">
        <Link to="/admin/add-product" className="p-5 bg-green-500 text-white rounded-md text-center">Add Product</Link>
        <Link to="/admin/remove-product" className="p-5 bg-red-500 text-white rounded-md text-center">Remove Product</Link>
        <Link to="/admin/product-list" className="p-5 bg-blue-500 text-white rounded-md text-center">View All Products</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
