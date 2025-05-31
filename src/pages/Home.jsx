import React, { useEffect, useState, useCallback } from "react";
import api from "../utils/axiosConfig";

import MainContent from "../components/MainContent.jsx";
import ProductCard from "../components/ProductCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const Home = ({ searchTerm = "" }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products once on mount
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        if (!isMounted) return;
        const data = Array.isArray(response.data) ? response.data : [];
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching products:", err.message);
        setError("Failed to load products. Please try again later.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products based on searchTerm
  const filterProducts = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter((product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  if (loading) {
    return (
      <MainContent>
        <LoadingSpinner />
      </MainContent>
    );
  }

  if (error) {
    return (
      <MainContent>
        <section
          role="alert"
          className="m-6 p-4 rounded-lg bg-red-700 text-red-100 text-center font-semibold shadow-md"
          aria-live="assertive"
        >
          {error}
        </section>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <h2
        className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-white tracking-wide neon-pulse drop-shadow-lg"
        tabIndex={0}
      >
        Our Latest Collection
      </h2>

      <main
        className="home-page w-full px-4 sm:px-6 md:px-10 max-w-[1280px] mx-auto"
        aria-live="polite"
      >
        {filteredProducts.length === 0 ? (
          <p
            className="text-center text-lg text-gray-300 italic mt-12 animate-pulse"
            aria-label={`No products found for "${searchTerm}"`}
          >
            No products found for{" "}
            <span className="font-semibold text-purple-400">"{searchTerm}"</span>
          </p>
        ) : (
          <section
            className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            aria-label="Product list"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </section>
        )}
      </main>
    </MainContent>
  );
};

export default Home;
