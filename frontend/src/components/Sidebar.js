import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = () => {
  const [company, setCompany] = useState({
    name: '',
    secondaryName: '',
    address: '',
    logo: ''
  });

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

  return (
    <div className="sidebar">
      <div className="logo-container">
        {company.logo && (
          <img src={`http://localhost:5000${company.logo}`} alt="Company Logo" className="company-logo" />
        )}
        <div className="info">
          <div className="company-name">{company.name}</div>
          <div className="company-secondary-name">{company.secondaryName}</div>
          <p className="company-address">{company.address}</p>
        </div>
      </div>
      <hr className="divider" />
      <div className="certification-system">
        <h3>Certification System</h3>
      </div>
      <ul className="menu">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/certificates">Certificates</a></li>
         <li><a href="/add-template">Add Template</a></li>
        <li><a href="/templates">View Templates</a></li>
        <li><a href="/reports">Reports</a></li>
        <li><a href="/support">Support</a></li>
        <li><a href="/settings">Settings</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
