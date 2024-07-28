import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './Templates.css';

const Templates = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/template')
      .then(response => setTemplates(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="templates-content">
          <h2>Templates</h2>
          <div className="template-list">
            {templates.map(template => (
              <div key={template._id} className="template-card">
                <h3>{template.name}</h3>
                <p>{template.content}</p>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Templates;
