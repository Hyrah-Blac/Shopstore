// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaCogs, FaTimes } from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-lg`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={toggleSidebar} className="text-white text-xl">
            <FaTimes />
          </button>
        </div>

        <ul className="p-4 space-y-4">
          <li>
            <Link
              to="/contacts"
              className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
              onClick={toggleSidebar}
            >
              <FaEnvelope /> Contacts
            </Link>
          </li>
          <li>
            <Link
              to="/checkout"
              className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
              onClick={toggleSidebar}
            >
              <FaCogs /> Checkout
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
