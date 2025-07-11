import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaTruck, FaCashRegister } from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const handleSidebarClick = (e) => {
    e.stopPropagation();
  };

  const userId = localStorage.getItem("userId") || "123"; // fallback

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-black text-white transform transition-transform duration-300 z-50 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      onClick={toggleSidebar}
    >
      <div onClick={handleSidebarClick} className="h-full">
        <ul className="mt-20 space-y-4 px-6 text-sm">
          <li>
            <Link
              to="/contacts"
              className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded transition-colors"
            >
              <FaEnvelope className="text-purple-400" />
              Contacts
            </Link>
          </li>
          <li>
            <Link
              to="/checkout"
              className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded transition-colors"
            >
              <FaCashRegister className="text-purple-400" />
              Checkout
            </Link>
          </li>
          <li>
            <Link
              to={`/user-orders/${userId}`}
              className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded transition-colors"
            >
              <FaTruck className="text-purple-400" />
              Your Orders
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
