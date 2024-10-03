import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './UserTemplateSelection.css';

const UserTemplateSelection = () => {
  const [templates, setTemplates] = useState([]); // Initialize as an empty array
  const [mostUsedTemplates, setMostUsedTemplates] = useState([]);
  const [userMostUsedTemplates, setUserMostUsedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(response.data);
      } catch (error) {
        setError('Error fetching categories');
        console.error('Error fetching categories:', error.response ? error.response.data : error.message);
      }
    };

    const fetchLoggedInUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLoggedInUserId(response.data._id);
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    };

    const fetchTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/templates', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTemplates(response.data || []); // Ensure the data is always an array
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
        setMostUsedTemplates(response.data || []); // Ensure the data is always an array
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
        setUserMostUsedTemplates(response.data || []); // Ensure the data is always an array
      } catch (error) {
        setError('Error fetching most used templates by user');
        console.error('Error fetching most used templates by user:', error.response ? error.response.data : error.message);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCategories(),
        fetchLoggedInUser(),
        fetchTemplates(),
        fetchMostUsedTemplates(),
        fetchUserMostUsedTemplates()
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Use search API whenever searchTerm changes
  useEffect(() => {
    const token = localStorage.getItem('token');

    const searchTemplates = async () => {
      if (searchTerm.trim() === '') {
        // If the search term is empty, fetch all templates again
        await fetchTemplates(); // You might want to create this function separately
      } else {
        try {
          const response = await axios.get(`http://localhost:5000/api/templates/search?templateName=${searchTerm}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTemplates(response.data.data || []); // Ensure the data is always an array
        } catch (error) {
          setError('Error searching templates');
          console.error('Error searching templates:', error.response ? error.response.data : error.message);
        }
      }
    };

    const fetchTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/templates', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTemplates(response.data || []); // Ensure the data is always an array
      } catch (error) {
        setError('Error fetching templates');
        console.error('Error fetching templates:', error.response ? error.response.data : error.message);
      }
    };

    searchTemplates();
  }, [searchTerm]);

  const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  // Ensure templates is treated as an array and filter it
  const filteredTemplates = Array.isArray(templates)
    ? templates.filter(template =>
        template.templateName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory ? template.category === selectedCategory : true)
      )
    : [];

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

          {/* Category Filter Dropdown */}
          <div>
            <label>Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <h3>Recently Used</h3>
          <div className="template-cards">
            {userMostUsedTemplates.length > 0 ? (
              userMostUsedTemplates.map((template) => {
                const currentUserUsage = template.userUsage.find(
                  (usage) => usage.userId.toString() === loggedInUserId
                );

                return (
                  <div
                    key={template._id}
                    className="template-card"
                    onClick={() => navigate(`/preview-template/${template._id}`)}
                    style={{ backgroundColor: getRandomColor() }}
                  >
                    <h3>{template.templateName}</h3>
                  </div>
                );
              })
            ) : (
              <p>No templates used by you found.</p>
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
