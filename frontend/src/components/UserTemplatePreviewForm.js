import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserTemplatePreviewForm = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTemplate = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from local storage

      try {
        const response = await axios.get(`http://localhost:5000/api/templates/${id}`, {
          headers: { Authorization: `Bearer ${token}` } // Include token in headers
        });
        setTemplate(response.data);
      } catch (err) {
        console.error('Error fetching template:', err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data.message : 'Error fetching template');
      }
    };

    fetchTemplate();
  }, [id]);

  return (
    <div>
      <h2>Template Preview</h2>
      {error && <p className="error">{error}</p>}
      {template ? (
        <div>
          <h3>{template.templateName}</h3>
          <div dangerouslySetInnerHTML={{ __html: template.content }} />
          {/* You can use a library or custom component to render and preview the template content */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserTemplatePreviewForm;
