// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaEnvelope,
  FaCogs,
} from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`} onClick={toggleSidebar}>
      <ul>
        <li>
          <Link to="/home" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
            <FaHome /> Home
          </Link>
        </li>
        <li>
          <Link to="/cart" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
            <FaShoppingCart /> Cart
          </Link>
        </li>
        <li>
          <Link to="/contacts" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
            <FaEnvelope /> Contacts
          </Link>
        </li>
        <li>
          <Link to="/checkout" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
            <FaCogs /> Checkout
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
