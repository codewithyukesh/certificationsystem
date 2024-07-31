import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './Templates.css';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false); // For success popup
  const [deleteError, setDeleteError] = useState(''); // For error popup
  const [showConfirmPopup, setShowConfirmPopup] = useState(false); // For delete confirmation popup
  const [selectedTemplateId, setSelectedTemplateId] = useState(null); // For storing template ID to delete
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from local storage

      try {
        const response = await axios.get('http://localhost:5000/api/templates', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error.response ? error.response.data : error.message);
        setError('Failed to fetch templates.');
      }
    };

    fetchTemplates();
  }, []);

  const handleView = (id) => {
    navigate(`/templates/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/templates/edit/${id}`);
  };

  const handleDeleteConfirmation = (id) => {
    setSelectedTemplateId(id);
    setShowConfirmPopup(true);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
  
    try {
      await axios.delete(`http://localhost:5000/api/templates/${selectedTemplateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(templates.filter(template => template._id !== selectedTemplateId));
      setDeleteSuccess(true);
    } catch (error) {
      console.error('Error deleting template:', error.response ? error.response.data : error.message);
      setDeleteError('Failed to delete template.');
    } finally {
      setShowConfirmPopup(false);
    }
  };
  

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="templates-content">
          <h2>Templates</h2>
          {error && <p className="error">{error}</p>}
          {templates.length > 0 ? (
            <table className="templates-table">
              <thead>
                <tr>
                  <th>S.N.</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template, index) => (
                  <tr key={template._id}>
                    <td>{index + 1}</td>
                    <td>{template.templateName}</td>
                    <td className="description">{template.content.substring(0, 100)}{template.content.length > 100 ? '...' : ''}</td>
                    <td>
                      <button className="view-button" onClick={() => handleView(template._id)}>View</button>
                      <button className="edit-button" onClick={() => handleEdit(template._id)}>Edit</button>
                      <button className="delete-button" onClick={() => handleDeleteConfirmation(template._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No templates found.</p>
          )}
          {showConfirmPopup && (
            <div className="popup">
              <div className="popup-content">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete this template?</p>
                <div className="popup-buttons">
                  <button onClick={handleDelete} className="confirm-button">Yes</button>
                  <button onClick={() => setShowConfirmPopup(false)} className="cancel-button">No</button>
                </div>
              </div>
            </div>
          )}
          {deleteSuccess && (
            <div className="popup">
              <div className="popup-content">
                <h3>Success!</h3>
                <p>Template deleted successfully.</p>
                <button onClick={() => setDeleteSuccess(false)} className="confirm-button">Close</button>
              </div>
            </div>
          )}
          {deleteError && (
            <div className="popup">
              <div className="popup-content">
                <h3>Error!</h3>
                <p>{deleteError}</p>
                <button onClick={() => setDeleteError('')} className="confirm-button">Close</button>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Templates;
