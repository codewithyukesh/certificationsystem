import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import CompanyProfileEdit from './components/CompanyProfileEdit';
import Templates from './components/Templates';
import CreateTemplate from './components/CreateTemplate';
import Reports from './components/Reports';
import AddTemplate from './components/AddTemplate';
import TemplateList from './components/TemplateList';
import TemplateView from './components/TemplateView';
import TemplateEdit from './components/TemplateEdit';
import UserTemplateSelection from './components/UserTemplateSelection';
import UserTemplateEditor from './components/UserTemplateEditor';
import TemplateInputForm from './components/TemplateInputForm';
import FiscalYear from './components/FiscalYear';
import SupportPage from './components/SupportPage';
import LetterheadList from './components/LetterheadList';
import LetterheadForm from './components/LetterheadForm';
import LetterheadView from './components/LetterheadView';
import Unauthorized from './components/Unauthorized';
import IssuedTemplates from './components/IssuedTemplates'; // Import IssuedTemplates component

const App = () => {
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user details', error);
        setUserRole('guest'); // Handle errors and set default role
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [token]);

  const protectAdminRoutes = (component) => {
    if (loading) return <div>Loading...</div>; // Show loading while fetching role
    return userRole === 'admin' ? component : <Navigate to="/unauthorized" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />

        {/* Protected admin routes */}
        <Route path="/settings" element={token ? protectAdminRoutes(<Settings />) : <Navigate to="/login" />} />
        <Route path="/settings/company-profile" element={token ? protectAdminRoutes(<CompanyProfileEdit />) : <Navigate to="/login" />} />
        <Route path="/settings/fiscal-year" element={token ? protectAdminRoutes(<FiscalYear />) : <Navigate to="/login" />} />
        <Route path="/add-template" element={token ? protectAdminRoutes(<AddTemplate />) : <Navigate to="/login" />} />
        <Route path="/letterhead-list" element={token ? protectAdminRoutes(<LetterheadList />) : <Navigate to="/login" />} />
        <Route path="/letterhead/add" element={token ? protectAdminRoutes(<LetterheadForm />) : <Navigate to="/login" />} />
        <Route path="/letterhead/edit/:id" element={token ? protectAdminRoutes(<LetterheadForm />) : <Navigate to="/login" />} />
        <Route path="/letterhead/view/:id" element={token ? protectAdminRoutes(<LetterheadView />) : <Navigate to="/login" />} />

        {/* Routes accessible to all authenticated users */}
        <Route path="/templates" element={token ? <Templates /> : <Navigate to="/login" />} />
        <Route path="/create-template" element={token ? <CreateTemplate /> : <Navigate to="/login" />} />
        <Route path="/templates/list" element={token ? <TemplateList /> : <Navigate to="/login" />} />
        <Route path="/templates/:id" element={token ? <TemplateView /> : <Navigate to="/login" />} />
        <Route path="/templates/edit/:id" element={token ? <TemplateEdit /> : <Navigate to="/login" />} />
        <Route path="/user/templates" element={token ? <UserTemplateSelection /> : <Navigate to="/login" />} />
        <Route path="/user/template/edit/:id" element={token ? <UserTemplateEditor /> : <Navigate to="/login" />} />
        <Route path="/preview-template/:id" element={token ? <TemplateInputForm /> : <Navigate to="/login" />} />
        <Route path="/issued-templates" element={token ? <IssuedTemplates /> : <Navigate to="/login" />} /> {/* Add this line for issued templates */}
        <Route path="/reports" element={token ? <Reports /> : <Navigate to="/login" />} />
        <Route path="/support" element={token ? <SupportPage /> : <Navigate to="/login" />} />

        {/* Unauthorized route */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
