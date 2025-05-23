// src/components/ProductsList.jsx
import React, { useEffect, useState } from 'react';

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.products); // Assuming your API returns a 'products' array
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products List</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              {product.imageUrl && <img src={product.imageUrl} alt={product.name} width="100" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsList;
