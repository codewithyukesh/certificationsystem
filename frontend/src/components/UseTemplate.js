import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UseTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [placeholders, setPlaceholders] = useState({});
  const [finalContent, setFinalContent] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/templates');
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates', error);
      }
    };
    fetchTemplates();
  }, []);

  const handleUseTemplate = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/templates/use', {
        templateId: selectedTemplate,
        placeholders
      });
      setFinalContent(response.data.content);
    } catch (error) {
      console.error('Error using template', error);
    }
  };

  const handlePlaceholderChange = (e) => {
    setPlaceholders({
      ...placeholders,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h2>Use Template</h2>
      <select onChange={(e) => setSelectedTemplate(e.target.value)}>
        <option value="">Select a template</option>
        {templates.map(template => (
          <option key={template._id} value={template._id}>{template.name}</option>
        ))}
      </select>
      {selectedTemplate && (
        <div>
          {Object.keys(placeholders).map(key => (
            <div key={key}>
              <input
                type="text"
                name={key}
                placeholder={key}
                value={placeholders[key]}
                onChange={handlePlaceholderChange}
              />
            </div>
          ))}
          <button onClick={handleUseTemplate}>Generate Document</button>
        </div>
      )}
      {finalContent && (
        <div>
          <h3>Final Document</h3>
          <div dangerouslySetInnerHTML={{ __html: finalContent }} />
        </div>
      )}
    </div>
  );
};

export default UseTemplate;
