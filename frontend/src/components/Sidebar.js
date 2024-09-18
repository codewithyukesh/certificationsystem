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
  
  const [userRole, setUserRole] = useState('');
 
  // Function to fetch user details (including role)
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
       setUserRole(response.data.role);  // Set the user's role
    } catch (err) {
      console.error('Error fetching user details', err);
       setUserRole('Error');
    }
  };

  useEffect(() => {
    // Fetch the company details
    axios.get('http://localhost:5000/api/company')
      .then(response => {
        if (response.data) {
          setCompany(response.data);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the company details!', error);
      });
    
    // Fetch the user details (role and username)
    fetchUserDetails();
  }, []);

  return (
    <div className="sidebar">
      {/* Company logo and details */}
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
      <hr className="divider" />

      {/* Sidebar Menu */}
      <ul className="menu">
        <li><a href="/dashboard">Dashboard</a></li>
        
        {/* Show these only if the user is an admin */}
        {userRole === 'admin' ? (
          <>
            <li><a href="/letterhead-list">LetterheadList</a></li>
            <li><a href="/add-template">Add Template</a></li>
            <li><a href="/templates">View Templates</a></li>
          </>
        ) : (
          <>
            {/* Keep the structure but hide them visually for non-admins */}
            <li style={{ display: 'none' }}><a href="/letterhead-list">LetterheadList</a></li>
            <li style={{ display: 'none' }}><a href="/add-template">Add Template</a></li>
            <li style={{ display: 'none' }}><a href="/templates">View Templates</a></li>
          </>
        )}

        <li><a href="/user/templates">Templates List</a></li>
        <li><a href="/issued-templates">Issued Templates </a></li>
        <li><a href="/reports">Reports</a></li>
        <li><a href="/support">Support</a></li>

        {/* Show Settings only for admin */}
        {userRole === 'admin' ? (
          <li><a href="/settings">Settings</a></li>
        ) : (
          <li style={{ display: 'none' }}><a href="/settings">Settings</a></li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
