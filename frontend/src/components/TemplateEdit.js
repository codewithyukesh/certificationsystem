import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Make sure this is imported
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './TemplateEdit.css';

const TemplateEdit = () => {
  const [templateName, setTemplateName] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplate = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        console.log('Token:', token); // Log the token to ensure it's being retrieved correctly
      
        try {
          const response = await axios.get(`http://localhost:5000/api/templates/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTemplateName(response.data.templateName);
          setContent(response.data.content);
        } catch (error) {
          console.error('Error fetching template:', error.response ? error.response.data : error.message);
          setError('Failed to fetch template.');
        }
      };
      

    fetchTemplate();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Retrieve token from local storage

    try {
      const response = await axios.put(
        `http://localhost:5000/api/templates/${id}`,
        { templateName, content },
        { headers: { Authorization: `Bearer ${token}` } } // Include token in headers
      );
      console.log('Template updated successfully:', response.data);
      navigate('/templates'); // Redirect to templates list page or any other desired page
    } catch (error) {
      console.error('Error updating template:', error.response ? error.response.data : error.message);
      setError('Failed to update template.');
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="edit-template-content">
          <h2>Edit Template</h2>
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
                required
              />
            </div>
            <button type="submit">Update Template</button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default TemplateEdit;
