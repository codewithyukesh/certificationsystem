import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo">LOGO</div>
        <div className="info">
          <div className="company-name">Company Name</div>
          <p className="company-address">1234 Address St, City, Country</p>
        </div>
      </div>
      <hr className="divider" />
      <div className="certification-system">
        <h3>Certification System</h3>
      </div>
      <ul className="menu">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/certificates">Certificates</a></li>
        <li><a href="/support">Support</a></li>
        <li><a href="/settings">Settings</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
