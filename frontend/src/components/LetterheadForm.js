import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './LetterheadForm.css';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const LetterheadForm = () => {
  const [letterhead, setLetterhead] = useState({
    companyName: '',
    secondaryName: '',
    address: '',
    footerText1: '',
    footerText2: '',
    logo: null
  });
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchLetterhead = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/letterhead/${id}`);
          setLetterhead({
            ...response.data,
            logo: null // Not setting logo here; it should be displayed separately
          });
        } catch (error) {
          setError(error.message);
        }
      };

      fetchLetterhead();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLetterhead((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setLetterhead((prevState) => ({
      ...prevState,
      logo: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('companyName', letterhead.companyName);
    formData.append('secondaryName', letterhead.secondaryName);
    formData.append('address', letterhead.address);
    formData.append('footerText1', letterhead.footerText1);
    formData.append('footerText2', letterhead.footerText2);
    if (letterhead.logo) {
      formData.append('logo', letterhead.logo);
    }

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/letterhead/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('http://localhost:5000/api/letterhead', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      navigate('/letterhead-list');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="letterhead-form-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="letterhead-form">
          <h2>{id ? 'Edit Letterhead' : 'Add New Letterhead'}</h2>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label>
              Company Name:
              <input
                type="text"
                name="companyName"
                value={letterhead.companyName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Secondary Name:
              <input
                type="text"
                name="secondaryName"
                value={letterhead.secondaryName}
                onChange={handleChange}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={letterhead.address}
                onChange={handleChange}
              />
            </label>
            <label>
              Footer Text 1:
              <input
                type="text"
                name="footerText1"
                value={letterhead.footerText1}
                onChange={handleChange}
              />
            </label>
            <label>
              Footer Text 2:
              <input
                type="text"
                name="footerText2"
                value={letterhead.footerText2}
                onChange={handleChange}
              />
            </label>
            <label>
              Logo:
              <input
                type="file"
                name="logo"
                onChange={handleFileChange}
              />
            </label>
            <button type="submit">Save</button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default LetterheadForm;
