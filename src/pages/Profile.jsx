import React, { useEffect, useState } from "react";
import "./Profile.css"; // Optional styling
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      // Corrected URL with /api/auth prefix (adjust if yours is different)
      const res = await axios.get("https://backend-5za1.onrender.com/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Backend returns { user: {...} }, so get user from res.data.user
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (error) {
    return (
      <div className="profile-container">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-card">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>
    </div>
  );
};

export default Profile;
