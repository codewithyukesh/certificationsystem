// src/components/LetterheadList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LetterheadList.css';

const LetterheadList = () => {
  const [letterheads, setLetterheads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLetterheads = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/letterheads', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLetterheads(response.data);
      } catch (error) {
        console.error('Error fetching letterheads:', error.response ? error.response.data : error.message);
      }
    };

    fetchLetterheads();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-letterhead/${id}`);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/letterheads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLetterheads(letterheads.filter(letterhead => letterhead._id !== id));
    } catch (error) {
      console.error('Error deleting letterhead:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="letterhead-list">
      <h2>Manage Letterheads</h2>
      {letterheads.map(letterhead => (
        <div key={letterhead._id} className="letterhead-item">
          <h3>{letterhead.name}</h3>
          <button onClick={() => handleEdit(letterhead._id)}>Edit</button>
          <button onClick={() => handleDelete(letterhead._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default LetterheadList;
