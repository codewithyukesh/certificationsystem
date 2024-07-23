import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import './App.css';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import CompanyProfileEdit from './components/CompanyProfileEdit';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/settings/company-profile" element={<CompanyProfileEdit />} />

      </Routes>
    </Router>
  );
};

 

export default App;
