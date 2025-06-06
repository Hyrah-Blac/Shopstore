import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";

// Make sure the URL starts with https:// or http://
const BACKEND_URL = "https://backend-5za1.onrender.com"; // Corrected backend URL

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("⚠️ All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("🚫 Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Server returned invalid JSON or HTML instead of JSON");
      }

      if (response.ok && data.token) {
        toast.success(
          <>
            <strong>🎉 Signup successful!</strong>
            <div>Redirecting you to login...</div>
          </>,
          {
            position: "top-center",
            autoClose: 3000,
            theme: "colored",
          }
        );

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(data.message || "❌ Signup failed", {
          position: "top-center",
          autoClose: 4000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error during signup:", error.message);
      toast.error("⚠️ Something went wrong. Check console for details.", {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="signup-container">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="signup-form">
        <h2>Create Account</h2>
        <p>Sign up and start your journey</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              autoComplete="name"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              autoComplete="email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a password"
              required
              autoComplete="new-password"
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
              autoComplete="new-password"
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
