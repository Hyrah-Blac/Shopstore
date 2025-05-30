// src/components/MainContent.jsx
import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import "../styles/MainContent.css";

/**
 * MainContent is a reusable wrapper that adds stylish glassmorphism
 * with responsiveness and theme-aware visuals.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The content to wrap inside main.
 * @param {string} [props.className] - Additional custom class names.
 */
const MainContent = ({ children, className = "" }) => {
  return (
    <main className={clsx("main-content", className)}>
      {children}
    </main>
  );
};

MainContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default MainContent;
