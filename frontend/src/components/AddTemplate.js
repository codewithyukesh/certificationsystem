import axios from 'axios';
import { useState } from 'react';

const AddTemplate = () => {
  const [templateName, setTemplateName] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Retrieve token from local storage

    try {
      const response = await axios.post(
        'http://localhost:5000/api/templates',
        { templateName, content },
        { headers: { Authorization: `Bearer ${token}` } } // Include token in headers
      );
      console.log('Template added successfully:', response.data);
      // Clear form or redirect as needed
    } catch (err) {
      console.error('Error adding template:', err.response ? err.response.data : err.message); // Log detailed error
      setError(err.response ? err.response.data.message : 'Error adding template');
    }
  };

  return (
    <div>
      <h1>Add Template</h1>
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
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Template</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AddTemplate;
