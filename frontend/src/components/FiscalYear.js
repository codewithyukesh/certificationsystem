// src/components/FiscalYear/FiscalYear.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './FiscalYear.css';

const FiscalYear = () => {
  const [fiscalYears, setFiscalYears] = useState([]);
  const [newFiscalYear, setNewFiscalYear] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFiscalYears();
  }, []);

  const fetchFiscalYears = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fiscal-years', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFiscalYears(response.data);
    } catch (err) {
      setError('Error fetching fiscal years');
    }
  };

  const handleAddFiscalYear = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/fiscal-years', { name: newFiscalYear }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFiscalYears([...fiscalYears, response.data]);
      setNewFiscalYear('');
    } catch (err) {
      setError('Error adding fiscal year');
    }
  };

  const handleActivateFiscalYear = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/fiscal-years/${id}/activate`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchFiscalYears();
    } catch (err) {
      setError('Error activating fiscal year');
    }
  };

  const handleDeactivateFiscalYear = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/fiscal-years/${id}/deactivate`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchFiscalYears();
    } catch (err) {
      setError('Error deactivating fiscal year');
    }
  };

  const handleDeleteFiscalYear = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/fiscal-years/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFiscalYears(fiscalYears.filter(fy => fy._id !== id));
    } catch (err) {
      setError('Error deleting fiscal year');
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="fiscal-year-content">
          <h2>Manage Fiscal Years</h2>
          <form onSubmit={handleAddFiscalYear} className="fiscal-year-form">
            <input
              type="text"
              value={newFiscalYear}
              onChange={(e) => setNewFiscalYear(e.target.value)}
              placeholder="Enter new fiscal year"
              required
            />
            <button type="submit">Add Fiscal Year</button>
          </form>
          {error && <div className="error">{error}</div>}
          <ul className="fiscal-year-list">
            {fiscalYears.map(fy => (
              <li key={fy._id} className="fiscal-year-item">
                <span className={fy.active ? 'active' : 'inactive'}>{fy.name}</span>
                <button onClick={() => handleActivateFiscalYear(fy._id)} disabled={fy.active}>Activate</button>
                <button onClick={() => handleDeactivateFiscalYear(fy._id)} disabled={!fy.active}>Deactivate</button>
                <button onClick={() => handleDeleteFiscalYear(fy._id)} className="delete-button">Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default FiscalYear;
