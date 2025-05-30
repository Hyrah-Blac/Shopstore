import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Sidebar from "./Sidebar";

import "./Navbar.module.css"; // Optional: only if you're using CSS Modules

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    setIsLoggedIn(!!token);
    setIsAdmin(role === "admin");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsProfileMenuOpen(false);
    navigate("/home");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfileMenu = () => {
    if (isLoggedIn) {
      setIsProfileMenuOpen((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <button
            id="hamburger-icon"
            className="navbar-icon"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          {location.pathname === "/home" && (
            <button
              className="navbar-icon"
              onClick={toggleSearchBar}
              aria-label="Toggle search bar"
              aria-expanded={isSearchOpen}
            >
              <FaSearch />
            </button>
          )}

          <Link
            to="/cart"
            className="navbar-icon"
            aria-label="Go to cart"
          >
            <FaShoppingCart />
          </Link>

          <button
            className="navbar-icon"
            onClick={toggleProfileMenu}
            aria-label={isLoggedIn ? "Open profile menu" : "Login"}
          >
            <FaUser />
          </button>
        </div>

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
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {isSidebarOpen && (
        <div ref={sidebarRef}>
          <Sidebar />
        </div>
      )}

      {isSearchOpen && location.pathname === "/home" && (
        <div className="search-container visible">
          <input
            type="text"
            className="search-bar"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
          />
          <button
            className="search-close-btn"
            onClick={toggleSearchBar}
          >
            <FaTimes />
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
