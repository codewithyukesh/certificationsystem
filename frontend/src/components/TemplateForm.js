import React, { useState } from 'react';

const TemplateForm = ({ template }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filledTemplate = renderTemplate(template.content, formData);
    console.log(filledTemplate);
    // Save filled template to the database or take further action
  };

  return (
    <form onSubmit={handleSubmit}>
      {template.placeholders.map((placeholder) => (
        <div key={placeholder}>
          <label>{placeholder}</label>
          <input
            type="text"
            name={placeholder}
            value={formData[placeholder] || ''}
            onChange={handleChange}
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

function renderTemplate(templateContent, formData) {
  let renderedContent = templateContent;

  for (const key in formData) {
    const placeholder = `{{${key}}}`;
    renderedContent = renderedContent.replace(new RegExp(placeholder, 'g'), formData[key]);
  }

  return renderedContent;
}

export default TemplateForm;
