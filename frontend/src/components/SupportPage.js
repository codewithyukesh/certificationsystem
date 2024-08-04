import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './SupportPage.css'; // Updated CSS file

const SupportPage = () => {
  const navigate = useNavigate();

  const handleContactUsClick = () => {
    // Functionality to be added later
  };

  return (
    <div className="support-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="support-content">
          <h2>Support</h2>
          <div className="contact-info">
            <div className="contact-item">
              <h3>Support Email</h3>
              <p>support@example.com</p>
            </div>
            <div className="contact-item">
              <h3>Support Phone</h3>
              <p>(123) 456-7890</p>
            </div>
          </div>
    
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SupportPage;
