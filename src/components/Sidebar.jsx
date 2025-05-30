// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaCogs } from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 z-50 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      onClick={toggleSidebar}
    >
      <ul className="mt-20 space-y-4 px-6">
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
