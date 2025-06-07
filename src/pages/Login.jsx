// src/pages/Login.jsx
import React, { useState } from "react";
import api from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.error("⚠️ Email and password are required");
      setLoading(false);
      return;
    }

    try {
      console.log("📤 Sending login request to /auth/login");

      const res = await api.post("/auth/login", {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      console.log("✅ Login successful:", res.data);

      const { token, role, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user)); // ✅ Store user object
      localStorage.setItem("userId", user._id); // ✅ Store user ID

      toast.success("🔓 Login successful!", {
        autoClose: 1500,
      });

      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }, 1600);
    } catch (err) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message ||
        err.message ||
        "❌ Login failed. Try again.";

      console.error(`🚫 Login error [${status}]:`, message);
      toast.error(`${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-form">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn">
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
