import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#3a0ca3] to-[#7209b7] text-white font-sans overflow-hidden">
      {/* Navbar fixed at top */}
      <Navbar />

      {/* Main content with glass effect */}
      <main className="flex-1 overflow-y-auto backdrop-blur-md bg-white/5 p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
