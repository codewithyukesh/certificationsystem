import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './LetterheadList.css';

const LetterheadList = () => {
  const [letterheads, setLetterheads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use navigate for navigation

  useEffect(() => {
    const fetchLetterheads = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/letterheads');
        setLetterheads(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchLetterheads();
  }, []);

  const handleActivate = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/letterhead/${id}/activate`);
      setLetterheads(letterheads.map(lh => lh._id === id ? { ...lh, active: true } : lh));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/letterhead/${id}/deactivate`);
      setLetterheads(letterheads.map(lh => lh._id === id ? { ...lh, active: false } : lh));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAdd = () => {
    navigate('/letterhead/add'); // Navigate to the add letterhead form
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="letterhead-list-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="letterhead-list-content">
          <button onClick={handleAdd} className="add-button">Add New Letterhead</button>
          <ul>
            {letterheads.map(letterhead => (
              <li key={letterhead._id} className={`letterhead-item ${letterhead.active ? 'active' : 'inactive'}`}>
                <h3>{letterhead.companyName}</h3>
                <button onClick={() => handleActivate(letterhead._id)} disabled={letterhead.active}>Activate</button>
                <button onClick={() => handleDeactivate(letterhead._id)} disabled={!letterhead.active}>Deactivate</button>
              </li>
            ))}
          </ul>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default LetterheadList;
