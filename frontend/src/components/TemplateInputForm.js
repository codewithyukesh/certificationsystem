import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Modal from './Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './TemplateInputForm.css';

const generateHeaderHTML = (letterhead) => `
  <div class="letterhead-header">
    <div class="header-left">
      <img src="http://localhost:5000/${letterhead.logo}" alt="Logo" />
      <div class="header-left-text">
        <p class="dispatch">Ref. No.: <br> Dispatch No.: </p>
      </div>
    </div>
    <div class="header-right">
      <h1 class="company-name">${letterhead.companyName}</h1>
      ${letterhead.secondaryName ? `<h2 class="secondary-name">${letterhead.secondaryName}</h2>` : ''}
      <p class="address">${letterhead.address}</p>
    </div>
    <hr class="header-divider" />
  </div>
`;

const generateFooterHTML = (letterhead) => `
  <div class="letterhead-footer">
    ${letterhead.footerText1 ? `<p>${letterhead.footerText1}</p>` : ''}
    ${letterhead.footerText2 ? `<p>${letterhead.footerText2}</p>` : ''}
  </div>
`;

const TemplateInputForm = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [inputData, setInputData] = useState({});
  const [previewContent, setPreviewContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editorContent, setEditorContent] = useState('');
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
        toast.error('Error fetching template.');
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

  const handlePreview = async () => {
    if (!isFormComplete()) {
      toast.error('Please fill all the required fields before previewing.');
      return;
    }

    const letterheadArray = JSON.parse(localStorage.getItem('letterheadData')) || [];
    const activeLetterhead = letterheadArray.find(letterhead => letterhead.active) || {};

    let content = template.content;
    Object.keys(inputData).forEach((key) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      content = content.replace(regex, inputData[key]);
    });

    // Construct full preview content
    const headerHTML = generateHeaderHTML(activeLetterhead);
    const footerHTML = generateFooterHTML(activeLetterhead);

    setEditorContent(content); // Set content for Quill editor
    setPreviewContent({ header: headerHTML, body: content, footer: footerHTML });
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
      toast.success('Template saved successfully!');
      navigate('/user-templates');
    } catch (error) {
      console.error('Error saving template:', error.response ? error.response.data : error.message);
      setError('Error saving template.');
      toast.error('Error saving template.');
    }
  };

  const handleSaveAndPrint = async () => {
    await handleSave();
    handlePrint();
  };
  
  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write('<html><head><title>Print</title>');
    
    printWindow.document.write('<style>');
    printWindow.document.write(`
      @media print {
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .print-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
        }

        .letterhead-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid #000;
          padding: 10px;
          box-sizing: border-box;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .header-left img {
          max-width: 100px;
          height: auto;
          margin-right: 10px;
        }

        .header-left-text {
          font-size: 12px;
          text-align: left;
        }

        .header-right {
          text-align: center;
          flex-grow: 1;
        }

        .company-name {
          font-size: 24px;
          margin: 0;
        }

        .secondary-name {
          font-size: 18px;
          margin: 5px 0;
        }

        .address {
          font-size: 14px;
          margin: 5px 0;
        }

        .header-divider {
          border: none;
          border-top: 1px solid #000;
          margin-top: 10px;
        }

        .letterhead-footer {
          position: absolute;
          bottom: 0;
          width: 100%;
          text-align: center;
          font-size: 14px;
          border-top: 1px solid #000;
          padding-top: 10px;
          box-sizing: border-box;
        }

        .template-content {
          font-size: 16px;
          line-height: 1.5;
          page-break-inside: avoid;
          margin-bottom: 20px;
          flex: 1;
        }

        .modal-buttons {
          display: none; /* Hide modal buttons during print */
        }

        @page {
          margin: 20mm;
        }
      }
    `);
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body><div class="print-container">');
    printWindow.document.write(`
      ${previewContent.header}
      <div class="template-content">
        ${previewContent.body}
      </div>
      ${previewContent.footer}
    `);
    printWindow.document.write('</div></body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  if (!template) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <ToastContainer />
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
          <div className="preview-container">
            <Modal show={showModal} onClose={() => setShowModal(false)}>
              <h3>Preview</h3>
              <div dangerouslySetInnerHTML={{ __html: previewContent.header }} />
              <ReactQuill
                value={editorContent}
                onChange={setEditorContent}
                modules={{
                  toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }],
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['link'],
                    ['clean']
                  ]
                }}
                readOnly={false}
              />
              <div dangerouslySetInnerHTML={{ __html: previewContent.footer }} />
              <div className="modal-buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={handlePrint}>Print</button>
                <button onClick={handleSaveAndPrint}>Save and Print</button>
              </div>
            </Modal>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default TemplateInputForm;
