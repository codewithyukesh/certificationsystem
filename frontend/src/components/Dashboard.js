import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
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
      <div className="main-content">
        <header className="header">
          <div className="fiscal-year">Fiscal Year: 2024</div>
          <div className="user-profile">
            <span>Logged in as: User</span>
            <button className="profile-button">Profile</button>
          </div>
        </header>
        <div className="content">
          {/* Main content goes here */}
          <h2>Welcome to the Dashboard</h2>
        </div>
        <footer className="footer">
          <p>&copy; 2024 Company Name. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
