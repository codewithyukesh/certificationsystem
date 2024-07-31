import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './TemplateView.css';

const TemplateView = () => {
  const [template, setTemplate] = useState(null);
  const { id } = useParams();
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchTemplate = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/templates/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTemplate(response.data);
      } catch (error) {
        console.error('Error fetching template:', error.response ? error.response.data : error.message);
        setError('Failed to fetch template.');
      }
    };

    fetchTemplate();
  }, [id]);

  const handleShowAllTemplates = () => {
    navigate('/templates'); // Navigate to the templates list page
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="template-view-content">
          <h2>View Template</h2>
<center>          <button onClick={handleShowAllTemplates}>Show All Templates</button>
</center>
          {error && <p className="error">{error}</p>}
          {template ? (
            <div>
              <h3>Title: {template.templateName}</h3>
              <h3>Description:</h3>
              <p dangerouslySetInnerHTML={{ __html: template.content }}></p>
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

export default TemplateView;
