import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Modal from './Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './TemplateInputForm.css';
import QuillTable from 'quill-table';
 
// Register the table module
Quill.register({
  'modules/table': QuillTable,
});

// Function to validate input based on placeholder name
const validatePlaceholderInput = (placeholderName, value) => {
  value = value.trim(); // Remove leading and trailing spaces

  // Validation logic
  switch (placeholderName) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'phone':
      return /^(?!0{10})\d{10}$/.test(value);
    case 'startDate':
    case 'endDate':
       return /^\d{4}-\d{2}-\d{2}$/.test(value);
    case 'name':
      return /^[A-Za-z\s]+$/.test(value);
    case 'address':
      return /^[A-Za-z0-9\s,]+$/.test(value);
    case 'zipCode':
      return /^(?!0{5})\d{5}$/.test(value);
    case 'city':
      return /^[A-Za-z\s]+$/.test(value);
    case 'state':
      return /^[A-Za-z\s]+$/.test(value);
    case 'country':
      return /^[A-Za-z\s]+$/.test(value);
    case 'username':
      return /^[a-zA-Z0-9_]{3,20}$/.test(value);
    case 'password':
      return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
    case 'url':
      return /^(https?:\/\/)?[^\s/$.?#].[^\s]*$/.test(value);
    case 'creditCard':
      return /^(?!0{16})\d{16}$/.test(value);
    case 'ssn':
      return /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/.test(value);
    case 'integer':
      return /^-?(?!0)\d+$/.test(value);
    case 'float':
      return /^-?(?!0{1,})\d+\.\d+$/.test(value);
    case 'hexColor':
      return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
    default:
      return true; // Default to valid for unspecified placeholders
  }
};


// Function to generate HTML for the header
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

// Function to generate HTML for the footer
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
  const [previewContent, setPreviewContent] = useState({ header: '', body: '', footer: '' });
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
    const seenPlaceholders = new Set(); // Track already added placeholders

    placeholders.forEach((placeholder) => {
      if (!seenPlaceholders.has(placeholder)) { // Only add if not already added
        initialData[placeholder] = '';
        seenPlaceholders.add(placeholder); // Mark as added
      }
    });

    setInputData(initialData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const isValid = validatePlaceholderInput(name, value);
    if (!isValid) {
      // Show an error toast message
      toast.error(`Invalid input for ${name}. Please check your entry.`);
      return; // Exit if the input is invalid
      
    }
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
        { 
          templateId: id, 
          inputData, 
          isIssued: true, 
          templateTitle: template.templateName,
          templateDescription: template.content // Replace with actual description if needed
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Increment the usage count
      await incrementTemplateUsage(id);
  
      toast.success('Template saved successfully!');
  
      // Delay the navigation to allow the toast to display
      setTimeout(() => {
        navigate('/user/templates');
      }, 1500); // 1.5-second delay
    } catch (error) {
      console.error('Error saving template:', error.response ? error.response.data : error.message);
      setError('Error saving template.');
      toast.error('Error saving template.');
    }
  };
  
  const incrementTemplateUsage = async (templateId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/api/templates/${templateId}/use`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error incrementing template usage:', error.response ? error.response.data : error.message);
    }
  };

  
  const handleSaveAndPrint = async () => {
    await handleSave();

    // Delay the print to allow the toast to display and navigation to complete
    setTimeout(() => {
      handlePrint();
    }, 1500); // 1.5-second delay
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
            {Object.keys(inputData).map((placeholder) => ( // Render unique placeholders
              <div key={placeholder} className="form-group">
                <label htmlFor={placeholder}>{placeholder}:</label>
                <input
                  type="text"
                  id={placeholder}
                  name={placeholder}
                  value={inputData[placeholder] || ''}
                  onChange={handleInputChange}
                />
              </div>
            ))}
            <div className="form-buttons">
              <button type="button" onClick={handlePreview} className="btn btn-primary">
                Preview
              </button>
              <button type="button" onClick={handleSave} className="btn btn-success">
                Save
              </button>
              <button type="button" onClick={handleSaveAndPrint} className="btn btn-warning">
                Save and Print
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div className="preview-content">
          <div dangerouslySetInnerHTML={{ __html: previewContent.header }} />
          <ReactQuill 
            value={editorContent} 
            onChange={(content) => setEditorContent(content)} 
            theme="snow" 
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['clean'],
                [{ 'table': 'insert' }]
              ],
            }}
          />
          <div dangerouslySetInnerHTML={{ __html: previewContent.footer }} />
        </div>
        <div className="modal-buttons">
          <button onClick={handleSave} className="btn btn-success">Save</button>
          <button onClick={handlePrint} className="btn btn-warning">Print</button>
        </div>
      </Modal>
    </div>
  );
};

export default TemplateInputForm;