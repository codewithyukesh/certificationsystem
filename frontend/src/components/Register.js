import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && password) {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/register', { username, password, role });
        if (response.status === 201) {
          localStorage.setItem('token', response.data.token); // Store JWT token
          alert('Registration successful');
          navigate('/dashboard'); // Redirect to dashboard
        }
      } catch (error) {
        setError('Registration failed: ' + (error.response?.data?.message || error.message));
      }
    } else {
      alert('Please fill out all fields');
    }
  };

  return (
    <div className="register-container">
      <div className="left-side">
        <div className="logo-container">
          <div className="logo">LOGO</div>
          <div className="info">
            <div className="company-name">Company Name</div>
            <p className="company-address">1234 Address St, City, Country</p>
          </div>
        </div>
        <div className="buttons">
          <button>Apply for Certificate</button>
          <button>Check Status</button>
          <button>Verify Certificate</button>
        </div>
      </div>
      <div className="right-side">
        <h2>Register for Certification System</h2>
        <p>Your tagline goes here</p>
        <form className="register-form" onSubmit={handleSubmit}>
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

          <label htmlFor="role">Role:</label>
          <select 
            id="role" 
            name="role" 
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {error && <p className="error">{error}</p>} {/* Display error message */}

          <button type="submit">Register</button>
        </form>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Register;
