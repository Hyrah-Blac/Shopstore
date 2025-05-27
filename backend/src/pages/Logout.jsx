import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth tokens
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('role');

    // Notify user and redirect
    toast.info("👋 Logging out...", { autoClose: 1000 });
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="logout-page">
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;