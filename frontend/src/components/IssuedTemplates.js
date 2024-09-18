import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './IssuedTemplates.css';

const IssuedTemplates = () => {
  const [issuedTemplates, setIssuedTemplates] = useState([]);

  useEffect(() => {
    const fetchIssuedTemplates = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/issued-templates/result', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIssuedTemplates(response.data);
      } catch (error) {
        console.error('Error fetching issued templates', error);
      }
    };

    fetchIssuedTemplates();
  }, []);

  const handleView = (templateId) => {
    // Handle view logic here
    console.log(`View template with ID: ${templateId}`);
  };

  const handleDelete = async (templateId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/issued-templates/result/${templateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIssuedTemplates(issuedTemplates.filter(template => template._id !== templateId));
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  return (
    <div className="issued-templates-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content">
          <h2>Issued Templates</h2>
          {issuedTemplates.length === 0 ? (
            <p>No issued templates found.</p>
          ) : (
            <div className="table-container">
              <table className="templates-table">
                <thead>
                  <tr>
                    <th>S.N.</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Issued On</th>
                    <th>Issued By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {issuedTemplates.map((template, index) => (
                    <tr key={template._id}>
                      <td>{index + 1}</td>
                      <td>{template.templateTitle || 'Unknown'}</td>
                      <td>{template.templateDescription || 'Unknown'}</td>
                      <td>{new Date(template.savedAt).toLocaleDateString()}</td>
                      <td>{template.userId ? template.userId.username : 'Unknown'}</td> {/* Display username */}
                      <td>
                        <button onClick={() => handleView(template._id)} className="view-button">View</button>
                        <button onClick={() => handleDelete(template._id)} className="delete-button">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default IssuedTemplates;
