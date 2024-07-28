import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TemplateList.css';

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);

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

  return (
    <div className="template-list-container">
      <h2>Available Templates</h2>
      <ul>
        {templates.map(template => (
          <li key={template._id}>
            <h3>{template.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: template.content }}></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TemplateList;
