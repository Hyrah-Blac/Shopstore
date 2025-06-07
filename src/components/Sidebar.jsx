import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaCogs, FaTruck } from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const handleSidebarClick = (e) => {
    e.stopPropagation();
  };

  // userId is here if needed for dynamic routes
  const userId = localStorage.getItem("userId") || "123"; // fallback for testing

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 z-50 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      onClick={toggleSidebar}
    >
      <div onClick={handleSidebarClick} className="h-full">
        <ul className="mt-20 space-y-4 px-6">
          <li>
            <Link
              to="/contacts"
              className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
            >
              <FaEnvelope /> Contacts
            </Link>
          </li>
          <li>
            <Link
              to="/checkout"
              className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
            >
              <FaCogs /> Checkout
            </Link>
          </li>
          <li>
            <Link
              to="/user-delivery-status"
              className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
            >
              <FaTruck /> Delivery Status
            </Link>
          </li>
          <li>
            <Link
              to="/user-orders"
              className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
            >
              <FaTruck /> Your Orders
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
