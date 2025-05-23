// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      // No token found — redirect to login
      navigate("/login");
      return;
    }

    try {
      // Decode JWT payload (base64)
      const base64Payload = token.split(".")[1];
      const decodedPayload = atob(base64Payload);
      const userInfo = JSON.parse(decodedPayload);

      setUser(userInfo);
    } catch (error) {
      console.error("Invalid or malformed token", error);
      // If token invalid, redirect to login and clear storage
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <div>
        <h2>Welcome, {user.name}</h2>
        <p>Email: {user.email}</p>
        {/* Add more profile information here if needed */}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
