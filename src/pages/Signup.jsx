import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const showToast = (type, message, options = {}) => {
    const config = {
      position: "top-center",
      autoClose: 4000,
      theme: "colored",
      ...options,
    };
    type === "success" ? toast.success(message, config) : toast.error(message, config);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      return showToast("error", "⚠️ All fields are required.");
    }

    if (password !== confirmPassword) {
      return showToast("error", "🚫 Passwords do not match.");
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const text = await response.text();
      if (text.startsWith("<!DOCTYPE")) throw new Error("Invalid response from server.");

      const data = JSON.parse(text);

      if (response.ok && data.token) {
        showToast(
          "success",
          <>
            <strong>🎉 Signup successful!</strong>
            <div>Redirecting to login...</div>
          </>,
          { autoClose: 3000 }
        );
        setTimeout(() => navigate("/login"), 3000);
      } else {
        showToast("error", data.message || "❌ Signup failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      showToast("error", "⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <ToastContainer />

      <div className="signup-form">
        <h2>Create Account</h2>
        <p>Sign up and start your journey</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="btn">
            Sign Up
          </button>
        </form>

        <div className="login-link">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="login-link-text">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
