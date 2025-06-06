import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const BASE_API_URL = import.meta.env.VITE_API_URL || "";
const IMAGE_BASE_URL = BASE_API_URL.endsWith("/")
  ? `${BASE_API_URL}assets/`
  : `${BASE_API_URL}/assets/`;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart", error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const exists = prevItems.find((item) => item.id === product.id);

      let imagePath = product.image?.trim();

      // Remove duplicated file extensions like .jpg.jpg
      imagePath = imagePath?.replace(/(\.(jpg|jpeg|png|webp)){2,}$/i, "$1");

      // Remove duplicated 'assets/assets/' prefix
      imagePath = imagePath?.replace(/^\/+/, "");
      if (imagePath?.startsWith("assets/assets/")) {
        imagePath = imagePath.replace("assets/assets/", "assets/");
      }

      // Prepend base URL if not a full URL
      if (imagePath && !/^https?:\/\//i.test(imagePath)) {
        imagePath = `${IMAGE_BASE_URL}${imagePath.replace(/ /g, "%20")}`;
      }

      if (exists) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: imagePath,
            quantity: 1,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    const quantity = Number(newQuantity);
    if (quantity <= 0) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
