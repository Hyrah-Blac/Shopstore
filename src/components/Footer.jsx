// src/components/Footer.jsx
import React from "react";
import { FaInstagram, FaPinterest, FaTwitter } from "react-icons/fa";
import "./Footer.module.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-logo">
          <h3>Dressin</h3>
          <p>Elevating your fashion game</p>
        </div>

        <div className="footer-socials">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pinterest"
            title="Pinterest"
          >
            <FaPinterest />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            title="Twitter"
          >
            <FaTwitter />
          </a>
        </div>

        <p className="footer-copy">
          &copy; {year} <strong>Dressin</strong>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
