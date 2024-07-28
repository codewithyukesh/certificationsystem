import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AddTemplate.css';

const AddTemplate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem('token');

      // Configure the headers to include the token
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      // Make the request with the token included
      const response = await axios.post('http://localhost:5000/api/templates', { title, content }, config);

      if (response.status === 201) {
        alert('Template added successfully');
      }
    } catch (error) {
      console.error('Error adding template', error);
    }
  };

  return (
    <div className="add-template-container">
      <h2>Add New Template</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label>Content</label>
        <ReactQuill value={content} onChange={setContent} />
        <button type="submit">Add Template</button>
      </form>
    </div>
  );
};

export default AddTemplate;
