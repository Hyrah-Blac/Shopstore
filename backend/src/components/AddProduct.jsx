import React, { useState } from 'react';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image); // This sends the image file

    // Update the fetch URL to point to your backend server
    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.message === 'Product added successfully') {
      alert('Product added!');
    } else {
      alert('Failed to add product');
    }
  };

  return (
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
        placeholder="Price" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
      />
      <input 
        type="file" 
        onChange={handleImageChange} 
      />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;
