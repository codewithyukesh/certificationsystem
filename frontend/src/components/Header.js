// src/components/Header/Header.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [activeFiscalYear, setActiveFiscalYear] = useState('N/A');
  const [userName, setUserName] = useState('User');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveFiscalYear = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fiscal-years', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const activeYear = response.data.find(fy => fy.active);
        setActiveFiscalYear(activeYear ? activeYear.name : 'N/A');
      } catch (err) {
        console.error('Error fetching active fiscal year', err);
        setActiveFiscalYear('Error');
      }
    };

    fetchActiveFiscalYear();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="fiscal-year">Fiscal Year: {activeFiscalYear}</div>
      <div className="user-profile">
        <span>Logged in as: {userName}</span>
        <button className="profile-button logout" onClick={handleLogout}>Logout</button>
        </div>
    </header>
  );
};

export default Header;
