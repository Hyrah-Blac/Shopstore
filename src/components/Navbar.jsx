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
    if (!isSidebarOpen) {
      setIsProfileMenuOpen(false);
      setIsSearchOpen(false);
    }
  };

  const toggleProfileMenu = () => {
    if (isLoggedIn) {
      setIsProfileMenuOpen((prev) => !prev);
      if (!isProfileMenuOpen) {
        setIsSidebarOpen(false);
        setIsSearchOpen(false);
      }
    } else {
      navigate("/login");
    }
  };

  const toggleSearchBar = () => {
    if (location.pathname === "/home") {
      setIsSearchOpen((prev) => {
        const newState = !prev;
        if (newState) {
          setIsSidebarOpen(false);
          setIsProfileMenuOpen(false);
        } else {
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
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(`.${styles["navbar-icon"]}`)
      ) {
        setIsSidebarOpen(false);
      }

      if (
        isProfileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        !event.target.closest(`.${styles["navbar-icon"]}`)
      ) {
        setIsProfileMenuOpen(false);
      }

      if (
        isSearchOpen &&
        !event.target.closest(`.${styles["search-input"]}`) &&
        !event.target.closest(`.${styles["navbar-icon"]}`)
      ) {
        setIsSearchOpen(false);
        setSearchTerm("");
        onFilter?.("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen, isProfileMenuOpen, isSearchOpen, onFilter]);

  return (
    <>
      <nav className={styles.navbar}>
        <Link to="/home" className={styles["logo-link"]}>
          Dressin
        </Link>

        <div className={styles["navbar-icons"]}>
          <button
            className={styles["navbar-icon"]}
            aria-label="Toggle Sidebar"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          <button
            className={styles["navbar-icon"]}
            aria-label="Search Products"
            onClick={toggleSearchBar}
          >
            <FaSearch />
          </button>

          <button
            className={styles["navbar-icon"]}
            aria-label="Shopping Cart"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart />
          </button>

          <button
            className={styles["navbar-icon"]}
            aria-label="User Profile"
            onClick={toggleProfileMenu}
          >
            <FaUser />
          </button>
        </div>

        {isSearchOpen && location.pathname === "/home" && (
          <div className={styles["search-container"]}>
            <input
              type="text"
              placeholder="Filter products..."
              className={styles["search-input"]}
              value={searchTerm}
              onChange={handleSearchChange}
              autoFocus
            />
          </div>
        )}

        {isProfileMenuOpen && (
          <div
            className={styles["profile-dropdown"]}
            ref={profileMenuRef}
            tabIndex={-1}
          >
            <ul>
              {isAdmin && (
                <>
                  <li>
                    <Link to="/admin">Admin Panel</Link>
                  </li>
                  <li>
                    <Link to="/add-product">Add Product</Link>
                  </li>
                  <li>
                    <Link to="/delete-product">Remove Product</Link>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    padding: "8px 16px",
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    color: "#eee",
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {isSidebarOpen && <Sidebar ref={sidebarRef} />}
    </>
  );
};

export default Navbar;
