import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './CompanyProfileEdit.css';

const CompanyProfileEdit = () => {
  const [company, setCompany] = useState({
    name: '',
    secondaryName: '',
    address: '',
    logo: ''
  });
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/company')
      .then(response => {
        if (response.data) {
          setCompany(response.data);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the company details!', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', company.name);
    formData.append('secondaryName', company.secondaryName);
    formData.append('address', company.address);
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    axios.post('http://localhost:5000/api/company', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        setCompany(response.data);
      })
      .catch(error => {
        console.error('There was an error updating the company details!', error);
      });
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-content">
          <h2>Edit Company Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Company Name</label>
              <input 
                type="text" 
                name="name" 
                value={company.name} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>Secondary Name</label>
              <input 
                type="text" 
                name="secondaryName" 
                value={company.secondaryName} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input 
                type="text" 
                name="address" 
                value={company.address} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>Logo</label>
              <input 
                type="file" 
                name="logo" 
                onChange={handleFileChange} 
              />
              {company.logo && (
                <img src={`http://localhost:5000${company.logo}`} alt="Company Logo" className="logo-preview" />
              )}
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default CompanyProfileEdit;
