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

import styles from "./Navbar.module.css";

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

  const toggleProfileMenu = () => {
    if (isLoggedIn) {
      setIsProfileMenuOpen((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  const toggleSearchBar = () => {
    if (location.pathname === "/home") {
      setIsSearchOpen((prev) => {
        const newState = !prev;
        if (!newState) {
          setSearchTerm("");
          onFilter?.("");
        }
        return newState;
      });
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilter?.(value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(`.${styles["navbar-icon"]}`)
      ) {
        setIsSidebarOpen(false);
      }

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [styles]);

  return (
    <>
      <nav className={styles.navbar}>
        <Link to="/home" className={styles["logo-link"]}>
          Dressin
        </Link>

        <div className={styles["navbar-icons"]}>
          <button
            className={styles["navbar-icon"]}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          {location.pathname === "/home" && (
            <button
              className={styles["navbar-icon"]}
              onClick={toggleSearchBar}
              aria-label="Toggle search bar"
              aria-expanded={isSearchOpen}
            >
              <FaSearch />
            </button>
          )}

          <Link to="/cart" className={styles["navbar-icon"]} aria-label="Cart">
            <FaShoppingCart />
          </Link>

          <button
            className={styles["navbar-icon"]}
            onClick={toggleProfileMenu}
            aria-label={isLoggedIn ? "Open profile menu" : "Login"}
          >
            <FaUser />
          </button>
        </div>

{isProfileMenuOpen && (
  <div className={styles["profile-dropdown"]} ref={profileMenuRef}>
    <ul>
      <li>
        <span
          style={{
            padding: "10px 16px",
            display: "block",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {localStorage.getItem("name") || localStorage.getItem("email") || "User"}
        </span>
      </li>
      <li>
        <Link to="/profile" onClick={() => setIsProfileMenuOpen(false)}>
          My Profile
        </Link>
      </li>
      {isAdmin && (
        <li>
          <Link to="/admin" onClick={() => setIsProfileMenuOpen(false)}>
            Admin Panel
          </Link>
        </li>
      )}
      <li>
        <button onClick={handleLogout}>Logout</button>
      </li>
    </ul>
  </div>
)}

      </nav>

      {/* Sidebar */}
      <div ref={sidebarRef}>
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {isSearchOpen && location.pathname === "/home" && (
        <div className={styles["search-container"]}>
          <input
            type="text"
            className={styles["search-bar"]}
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
          />
          <button
            className={styles["search-close-btn"]}
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

export default Navbar;
