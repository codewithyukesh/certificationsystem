import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './UserTemplateSelection.css';

const UserTemplateSelection = () => {
  const [templates, setTemplates] = useState([]);
  const [mostUsedTemplates, setMostUsedTemplates] = useState([]);
  const [userMostUsedTemplates, setUserMostUsedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/templates', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTemplates(response.data);
      } catch (error) {
        setError('Error fetching templates');
        console.error('Error fetching templates:', error.response ? error.response.data : error.message);
      }
    };

    const fetchMostUsedTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/templates/most-used', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMostUsedTemplates(response.data);
      } catch (error) {
        setError('Error fetching most used templates globally');
        console.error('Error fetching most used templates:', error.response ? error.response.data : error.message);
      }
    };

    const fetchUserMostUsedTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/templates/user-most-used', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserMostUsedTemplates(response.data);
      } catch (error) {
        setError('Error fetching most used templates by user');
        console.error('Error fetching most used templates by user:', error.response ? error.response.data : error.message);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchTemplates(), fetchMostUsedTemplates(), fetchUserMostUsedTemplates()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  const filteredTemplates = templates.filter(template =>
    template.templateName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading templates...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="user-template-selection-content">
          <h2>Select a Template</h2>

          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <h3>Most Used by You</h3>
          <div className="template-cards">
            {userMostUsedTemplates.length > 0 ? (
              userMostUsedTemplates.map((template) => (
                <div
                  key={template._id}
                  className="template-card"
                  onClick={() => navigate(`/preview-template/${template._id}`)}
                  style={{ backgroundColor: getRandomColor() }}
                >
                  <div className="usage-count">
                    {template.usageCount} uses
                  </div>
                  <h3>{template.templateName}</h3>
                </div>
              ))
            ) : (
              <p>No templates used by you found.</p>
            )}
          </div>

          <h3>Most Used Globally</h3>
          <div className="template-cards">
            {mostUsedTemplates.length > 0 ? (
              mostUsedTemplates.map((template) => (
                <div
                  key={template._id}
                  className="template-card"
                  onClick={() => navigate(`/preview-template/${template._id}`)}
                  style={{ backgroundColor: getRandomColor() }}
                >
                  <div className="usage-count">
                    {template.usageCount} times
                  </div>
                  <h3>{template.templateName}</h3>
                </div>
              ))
            ) : (
              <p>No globally popular templates found.</p>
            )}
          </div>

          <h3>All Templates</h3>
          <div className="template-cards">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <div
                  key={template._id}
                  className="template-card"
                  onClick={() => navigate(`/preview-template/${template._id}`)}
                  style={{ backgroundColor: getRandomColor() }}
                >
                  <h3>{template.templateName}</h3>
                </div>
              ))
            ) : (
              <p>No templates available.</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default UserTemplateSelection;
