import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Pages & Components
import Layout from "./components/Layout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard"; // corrected import (was AdminOrders)
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import ProductAdded from "./pages/ProductAdded";
import DeleteProduct from "./pages/DeleteProduct";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import EditProductPrices from "./pages/EditProductPrices";
import Contacts from "./pages/Contacts";
import Profile from "./pages/Profile";
import AdminOrdersPage from "./pages/AdminOrdersPage"; // added correct import path
import UserDeliveryStatusPage from "./pages/UserDeliveryStatusPage";

// Styles
import "./App.css";
import "./styles/MainContent.css";

// Protected route wrapper
const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (roleRequired && role !== roleRequired) return <Navigate to="/home" replace />;

  return children;
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <Routes>
        {/* Shared layout for navbar/sidebar pages */}
        <Route element={<Layout onFilter={setSearchTerm} />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home searchTerm={searchTerm} />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin-only routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute roleRequired="admin">
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-added"
            element={
              <ProtectedRoute roleRequired="admin">
                <ProductAdded />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delete-product"
            element={
              <ProtectedRoute roleRequired="admin">
                <DeleteProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-product-prices"
            element={
              <ProtectedRoute roleRequired="admin">
                <EditProductPrices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-orders"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminOrdersPage />
              </ProtectedRoute>
            }
          />

          {/* User-only route (order tracking) */}
          <Route
            path="/user-delivery-status/:orderId"
            element={
              <ProtectedRoute>
                <UserDeliveryStatusPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
