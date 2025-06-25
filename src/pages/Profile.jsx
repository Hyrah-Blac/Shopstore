import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaUserShield } from "react-icons/fa";
import "./Profile.css";
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

      const res = await axios.get(
        "https://backend-5za1.onrender.com/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="profile-container">
      {error ? (
        <p className="error-message">{error}</p>
      ) : !user ? (
        <p className="loading">Loading profile...</p>
      ) : (
        <div className="profile-card glass">
          <h2 className="profile-title">👤 My Profile</h2>
          <div className="profile-item">
            <FaUser className="profile-icon" />
            <span><strong>Name:</strong> {user.name}</span>
          </div>
          <div className="profile-item">
            <FaEnvelope className="profile-icon" />
            <span><strong>Email:</strong> {user.email}</span>
          </div>
          <div className="profile-item">
            <FaUserShield className="profile-icon" />
            <span><strong>Role:</strong> {user.role}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
