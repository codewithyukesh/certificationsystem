import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './LetterheadView.css';

const LetterheadView = () => {
  const [letterhead, setLetterhead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get the letterhead ID from the URL

  useEffect(() => {
    const fetchLetterhead = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/letterhead/${id}`);
        setLetterhead(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchLetterhead();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!letterhead) {
    return <div>No letterhead found</div>;
  }
 
  // Construct full URL for logo image
  const logoUrl = letterhead.logo ? `http://localhost:5000/${letterhead.logo}` : '';

  return (
    <div className="letterhead-view-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="letterhead-view-content">
          {/* Header Section */}
          <div className="header-section">
            {logoUrl && <img src={logoUrl} alt="Logo" className="logo" />}
            <div className="header-text">
              <h1 className="company-name">{letterhead.companyName}</h1>
              {letterhead.secondaryName && <h2 className="secondary-name">{letterhead.secondaryName}</h2>}
              {letterhead.address && <p className="address">{letterhead.address}</p>}
            </div>
            <hr className="header-divider" />
          </div>

          {/* Main Content Section */}
          <div className="main-content-section">
            {/* Add any additional content or details here */}
          </div>

          <hr className="content-divider" />

          {/* Footer Section */}
          <div className="footer-section">
            {letterhead.footerText1 && <p className="footer-text">{letterhead.footerText1}</p>}
            {letterhead.footerText2 && <p className="footer-text">{letterhead.footerText2}</p>}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default LetterheadView;
