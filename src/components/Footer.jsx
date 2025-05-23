// src/components/Footer.jsx
import React from "react";
import "./Footer.module.css";

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <p>&copy; {new Date().getFullYear()} Dressin. All rights reserved.</p>
    </footer>
  );
};

export default Footer;