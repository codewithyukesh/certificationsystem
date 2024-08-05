import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

    if (!username || !password) {
      toast.error('Please fill out both fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      if (response.status === 200) {
        const { token, letterheadId } = response.data;
        localStorage.setItem('token', token); // Store JWT token

        // Fetch letterhead data and store it in local storage
        try {
          const letterheadResponse = await axios.get('http://localhost:5000/api/letterhead');
          localStorage.setItem('letterheadData', JSON.stringify(letterheadResponse.data));
        } catch (error) {
          console.error('Error fetching letterhead data:', error);
          toast.error('Error fetching letterhead data');
        }

        // Fetch and store active letterhead ID if available
        if (letterheadId) {
          localStorage.setItem('activeLetterheadId', letterheadId);
        }

        // Show success toast and redirect immediately
        toast.success('Login successful', {
          autoClose: 1000, // Toast duration (1 second)
          onClose: () => {
            navigate('/dashboard'); // Redirect to dashboard
          },
        });

        // Redirect immediately as well
        setTimeout(() => {
          navigate('/dashboard'); // Redirect to dashboard
        }, 1000); // Short delay to ensure toast is processed
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Invalid username or password'); // Unauthorized
      } else if (error.response && error.response.status === 500) {
        toast.error('Server error. Please try again later.'); // Server error
      } else {
        toast.error('Network error. Please check your connection.'); // Network error
      }
    }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="logo-container">
          {companyDetails.logo && (
            <img
              src={`http://localhost:5000${companyDetails.logo}`}
              alt="Company Logo"
              className="company-logo"
            />
          )}
          <div className="info">
            <div className="company-name">{companyDetails.name}</div>
            {companyDetails.secondaryName && (
              <div className="company-secondary-name">{companyDetails.secondaryName}</div>
            )}
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

          <button type="submit">Login</button>
        </form>
      </div>
      <footer className="footer">
        <p>&copy; 2024 {companyDetails.name}. All rights reserved.</p>
      </footer>
      <ToastContainer /> {/* Add ToastContainer to render the toast notifications */}
    </div>
  );
};

export default Login;
