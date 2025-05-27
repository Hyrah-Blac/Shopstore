// src/components/Navbar.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes
} from "react-icons/fa";

import "./Navbar.module.css";
import Sidebar from "./Sidebar"; // ✅ Assumes Sidebar uses default export

const Navbar = ({ onFilter }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef(null);
  const sidebarRef = useRef(null);

  // Check login status and role
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    setIsLoggedIn(!!token);
    setIsAdmin(role === "admin");
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsProfileMenuOpen(false);
    navigate("/home");
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Close sidebar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".navbar-icon")
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle profile menu
  const toggleProfileMenu = () => {
    if (isLoggedIn) {
      setIsProfileMenuOpen((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle search bar
  const toggleSearchBar = () => {
    if (location.pathname === "/home") {
      setIsSearchOpen((prev) => {
        const newState = !prev;
        if (!newState) {
          setSearchTerm("");
          if (onFilter) onFilter("");
        }
        return newState;
      });
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onFilter) onFilter(value);
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/home" className="logo-link">Dressin</Link>

        <div className="navbar-icons">
          {/* Hamburger */}
          <button
            id="hamburger-icon"
            className="navbar-icon"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarOpen}
            tabIndex={0}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Search Button */}
          {location.pathname === "/home" && (
            <button
              className="navbar-icon"
              onClick={toggleSearchBar}
              aria-label="Toggle search bar"
              aria-expanded={isSearchOpen}
              tabIndex={0}
            >
              <FaSearch />
            </button>
          )}

          {/* Cart Button */}
          <Link
            to="/cart"
            className="navbar-icon"
            aria-label="Go to cart"
            tabIndex={0}
          >
            <FaShoppingCart />
          </Link>

          {/* User Button */}
          <button
            className="navbar-icon"
            onClick={toggleProfileMenu}
            aria-label={isLoggedIn ? "Open profile menu" : "Login"}
            tabIndex={0}
          >
            <FaUser />
          </button>
        </div>

        {/* Profile Dropdown */}
        {isProfileMenuOpen && (
          <div className="profile-dropdown" ref={profileMenuRef}>
            <ul>
              <li>
                <span className="block px-4 py-2 text-sm font-semibold text-white">
                  {localStorage.getItem("email") || "User"}
                </span>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-purple-600"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  My Profile
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className="block px-4 py-2 hover:bg-purple-600"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-800"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Search Bar */}
      {isSearchOpen && location.pathname === "/home" && (
        <div className="search-container visible">
          <input
            type="text"
            className="search-bar"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
            aria-label="Search products"
          />
          <button
            className="search-close-btn"
            onClick={toggleSearchBar}
            aria-label="Close search"
          >
            <FaTimes />
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar; // ✅ This line fixes the error