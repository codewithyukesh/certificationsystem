import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content">
          {/* Main content goes here */}
          <h2>Welcome to the Dashboard</h2>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
