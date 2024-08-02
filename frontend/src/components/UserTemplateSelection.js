import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './UserTemplateSelection.css';

const UserTemplateSelection = () => {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/templates', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error.response ? error.response.data : error.message);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateClick = (id) => {
    navigate(`/preview-template/${id}`);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="user-template-selection-content">
          <h2>Select a Template</h2><br></br>
          <div className="template-cards">
            {templates.map((template) => (
              <div
                key={template._id}
                className="template-card"
                onClick={() => handleTemplateClick(template._id)}
                style={{ backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}` }} // Random background color
              >
                <h3>{template.templateName}</h3>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default UserTemplateSelection;
