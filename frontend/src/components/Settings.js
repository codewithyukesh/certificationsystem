import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();

  const handleCompanyProfileClick = () => {
    navigate('/settings/company-profile');
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="settings-content">
          <h2>Settings</h2>
          <div className="card" onClick={handleCompanyProfileClick}>
            <h3>Company Profile</h3>
            <p>View and edit company details</p>
          </div>
          <div className="card">
            <h3>Personal Details</h3>
            <p>Update your personal information</p>
          </div>
          <div className="card">
            <h3>Preferences</h3>
            <p>Set your application preferences</p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Settings;
