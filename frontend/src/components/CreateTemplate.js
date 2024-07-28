import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './CreateTemplate.css';

const CreateTemplate = () => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [placeholders, setPlaceholders] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/template', {
        name,
        content,
        placeholders: placeholders.split(',').map(p => p.trim())
      });
      if (response.status === 201) {
        alert('Template created successfully');
        setName('');
        setContent('');
        setPlaceholders('');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create template');
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="create-template-content">
          <h2>Create Template</h2>
          <form className="create-template-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Template Name:</label>
            <input 
              type="text" 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />

            <label htmlFor="content">Template Content:</label>
            <textarea 
              id="content" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required 
            />

            <label htmlFor="placeholders">Placeholders (comma separated):</label>
            <input 
              type="text" 
              id="placeholders" 
              value={placeholders}
              onChange={(e) => setPlaceholders(e.target.value)}
              required 
            />

            <button type="submit">Create Template</button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default CreateTemplate;
