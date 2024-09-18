import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './Unauthorized.css'; // Create this file for styling

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="unauthorized-content">
          <h1>403 - Unauthorized</h1>
          <p>You do not have permission to view this page.</p>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Unauthorized;
