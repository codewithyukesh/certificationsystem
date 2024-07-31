import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Make sure this is imported
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './UserTemplateEditor.css';

const UserTemplateEditor = () => {
  const [template, setTemplate] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams(); // Extract the ID from the URL

  useEffect(() => {
    const fetchTemplate = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/templates/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTemplate(response.data);
        setContent(response.data.content);
      } catch (error) {
        console.error('Error fetching template:', error.response ? error.response.data : error.message);
        setError('Failed to fetch template.');
      }
    };

    fetchTemplate();
  }, [id]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/api/templates/${id}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Template updated successfully');
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
        <div className="user-template-editor-content">
          <h2>Edit Template</h2>
          {error && <p className="error">{error}</p>}
          {template ? (
            <div>
              <h3>{template.templateName}</h3>
              <ReactQuill value={content} onChange={setContent} theme="snow" />
              <button onClick={handleSave}>Save</button>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default UserTemplateEditor;
