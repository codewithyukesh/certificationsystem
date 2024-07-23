import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompanyProfileEdit.css';

const CompanyProfileEdit = () => {
  const [company, setCompany] = useState({
    name: '',
    address: '',
    logo: '',
    tagline: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/company');
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    fetchCompanyDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(company),
      });
      navigate('/settings');
    } catch (error) {
      console.error('Error updating company details:', error);
    }
  };

  return (
    <div className="company-profile-edit">
      <h2>Edit Company Profile</h2>
      <form onSubmit={handleSubmit} className="company-form">
        <div className="form-group">
          <label htmlFor="name">Company Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={company.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Company Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={company.address}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="logo">Company Logo URL:</label>
          <input
            type="text"
            id="logo"
            name="logo"
            value={company.logo}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tagline">Company Tagline:</label>
          <input
            type="text"
            id="tagline"
            name="tagline"
            value={company.tagline}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="save-button">Save Changes</button>
      </form>
    </div>
  );
};

export default CompanyProfileEdit;
