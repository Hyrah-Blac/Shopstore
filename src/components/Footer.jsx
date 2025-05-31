import React from "react";
import styles from "./Footer.module.css";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.content}>
        <p>&copy; {new Date().getFullYear()} Dressin. All rights reserved.</p>
        <div className={styles.socials}>
        
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
