// src/utils/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
