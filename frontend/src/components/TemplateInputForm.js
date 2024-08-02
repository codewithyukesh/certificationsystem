// src/components/TemplateInputForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Modal from './Modal';
import ErrorModal from './ErrorModal';
import './TemplateInputForm.css';

const TemplateInputForm = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [inputData, setInputData] = useState({});
  const [previewContent, setPreviewContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplate = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/templates/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTemplate(response.data);
        initializeInputData(response.data.placeholders);
      } catch (error) {
        console.error('Error fetching template:', error.response ? error.response.data : error.message);
        setError('Error fetching template.');
      }
    };

    fetchTemplate();
  }, [id]);

  const initializeInputData = (placeholders) => {
    const initialData = {};
    placeholders.forEach((placeholder) => {
      initialData[placeholder] = '';
    });
    setInputData(initialData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isFormComplete = () => {
    return Object.values(inputData).every(value => value.trim() !== '');
  };

  const handlePreview = () => {
    if (!isFormComplete()) {
      setShowErrorModal(true);
      return;
    }
    let content = template.content;
    Object.keys(inputData).forEach((key) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      content = content.replace(regex, inputData[key]);
    });
    setPreviewContent(content);
    setShowModal(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/api/saved-templates',
        { templateId: id, inputData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Template saved successfully!');
      navigate('/user-templates');
    } catch (error) {
      console.error('Error saving template:', error.response ? error.response.data : error.message);
      setError('Error saving template.');
    }
  };

  const handleSaveAndPrint = async () => {
    await handleSave();
    handlePrint();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    printWindow.document.write(previewContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  if (!template) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="template-input-form-content">
        <h2>{template.templateName}</h2>
        <form>
            {template.placeholders.map((placeholder) => (
              <div key={placeholder}>
                <label>{placeholder}:</label>
                <input
                  type="text"
                  name={placeholder}
                  value={inputData[placeholder] || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ))}
          </form>
          <button onClick={handlePreview}>Preview</button>
          <Modal show={showModal} onClose={() => setShowModal(false)}>
            <h3>Preview</h3>
            <ReactQuill value={previewContent} readOnly={true} theme="bubble" />
            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={handlePrint}>Print</button>
              <button onClick={handleSaveAndPrint}>Save and Print</button>
            </div>
          </Modal>
          <ErrorModal 
            show={showErrorModal} 
            onClose={() => setShowErrorModal(false)} 
            message="Please fill out all fields before previewing." 
          />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default TemplateInputForm;
