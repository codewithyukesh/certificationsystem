import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Ensure this is imported
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './AddTemplate.css';

const AddTemplate = () => {
  const [templateName, setTemplateName] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Retrieve token from local storage

    try {
      const response = await axios.post(
        'http://localhost:5000/api/templates',
        { templateName, content },
        { headers: { Authorization: `Bearer ${token}` } } // Include token in headers
      );
      console.log('Template added successfully:', response.data);
      // Clear form or redirect as needed
      navigate('/templates'); // Redirect to templates list page or any other desired page
    } catch (err) {
      console.error('Error adding template:', err.response ? err.response.data : err.message); // Log detailed error
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
              <label>Content:</label>
              <ReactQuill
                value={content}
                onChange={setContent}
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
