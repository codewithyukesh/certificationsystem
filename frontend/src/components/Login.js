import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [companyDetails, setCompanyDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/company');
        setCompanyDetails(response.data);
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    fetchCompanyDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && password) {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token); // Store JWT token
          alert('Login successful');
          navigate('/dashboard'); // Redirect to dashboard
        }
      } catch (error) {
        setError('Invalid credentials');
      }
    } else {
      alert('Please fill out both fields');
    }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="logo-container">
          <img src={`http://localhost:5000${companyDetails.logo}`} alt="Company Logo" className="company-logo" />
          <div className="info">
            <div className="company-name">{companyDetails.name}</div>
            <div className="company-secondary-name">{companyDetails.secondaryName}</div>
            <p className="company-address">{companyDetails.address}</p>
          </div>
        </div>
        <div className="buttons">
          <button>Apply for Certificate</button>
          <button>Check Status</button>
          <button>Verify Certificate</button>
        </div>
      </div>
      <div className="right-side">
        <h2>Certification System</h2>
        <p>Your tagline goes here</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-required="true"
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
          />

          {error && <p className="error">{error}</p>} {/* Display error message */}

          <button type="submit">Login</button>
        </form>
      </div>
      <footer className="footer">
        <p>&copy; 2024 {companyDetails.name}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
