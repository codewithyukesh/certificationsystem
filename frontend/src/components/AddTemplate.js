import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './AddTemplate.css';

// Utility function to extract placeholders from template content
const extractPlaceholders = (content) => {
  const regex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
  let match;
  const placeholders = [];
  while ((match = regex.exec(content)) !== null) {
    placeholders.push(match[1]);
  }
  return placeholders;
};

const AddTemplate = () => {
  const [templateName, setTemplateName] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [placeholders, setPlaceholders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]); // State for categories
  const navigate = useNavigate();

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories'); // Replace with your API endpoint
        setCategories(response.data); // Assuming the response is an array of categories
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories.');
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    try {
      // Extract placeholders from the content
      const extractedPlaceholders = extractPlaceholders(content);
      const response = await axios.post(
        'http://localhost:5000/api/templates',
        { templateName, content, placeholders: extractedPlaceholders, category: selectedCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Template added successfully:', response.data);
      navigate('/templates'); // Redirect to templates list page or any other desired page
    } catch (err) {
      console.error('Error adding template:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : 'Error adding template');
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'color', 'background', 'align', 'script'
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="add-template-content">
          <h2>Add Template</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Template Name:</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Content:</label>
              <ReactQuill
                value={content}
                onChange={(newContent) => {
                  setContent(newContent);
                  setPlaceholders(extractPlaceholders(newContent));
                }}
                theme="snow"
                modules={modules}
                formats={formats}
                required
              />
            </div>
            <button type="submit">Add Template</button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AddTemplate;
