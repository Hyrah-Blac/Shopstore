import React, { useState } from 'react';
import api from '../utils/axiosConfig'; // Use the same API config as Home.jsx
import './AddProduct.css';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !image) {
      setMessage("⚠️ All fields are required.");
      return;
    }

    setMessage('');
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);

    try {
      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('✅ Product added successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setImage(null);
      document.getElementById("imageInput").value = '';
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setMessage(`❌ Failed to add product. ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-form">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price (KSH)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default AddProduct;
