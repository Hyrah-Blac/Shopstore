import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
             
import "./styles/MainContent.css"; // Your custom CSS

// Enable dark mode on document root
document.documentElement.classList.add("dark");

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <CartProvider>
        <App />
      </CartProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found. Please check index.html");
}
