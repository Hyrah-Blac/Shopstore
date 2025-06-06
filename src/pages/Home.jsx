import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";

import MainContent from "../components/MainContent.jsx";
import ProductCard from "../components/ProductCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const Home = ({ searchTerm = "" }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        const data = Array.isArray(response.data) ? response.data : [];
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

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
        <div
          role="alert"
          className="m-6 p-6 rounded-xl bg-red-700/90 text-white text-center font-semibold shadow-lg backdrop-blur-md"
        >
          {error}
        </div>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-white tracking-wide neon-pulse drop-shadow-lg">
        Our Latest Collection
      </h2>

      <div className="home-page w-full px-2 sm:px-6 md:px-10 max-w-[1440px] mx-auto">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-lg text-gray-300 italic mt-12">
            No products found for{" "}
            <span className="font-semibold text-purple-400">"{searchTerm}"</span>
          </p>
        ) : (
          <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </MainContent>
  );
};

export default Home;
