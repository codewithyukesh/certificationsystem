import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import './App.css';
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
import UserTemplatePreviewForm from './components/UserTemplatePreviewForm'; // Import the component
import TemplateInputForm from './components/TemplateInputForm'; // Import the new component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/templates" element={<Templates />} />
          <Route path="/create-template" element={<CreateTemplate />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/add-template" element={<AddTemplate />} />
            <Route path="/templates" element={<TemplateList />} />
        <Route path="/templates/add" element={<AddTemplate />} />
        <Route path="/templates/:id" element={<TemplateView />} />
        <Route path="/templates/edit/:id" element={<TemplateEdit />} />
        <Route path="/user/templates" element={<UserTemplateSelection />} />
            <Route path="/user/template/edit/:id" element={<UserTemplateEditor />} />
            {/* <Route path="/preview-template/:id" element={<UserTemplatePreviewForm />} /> New route */}
            <Route path="/preview-template/:id" element={<TemplateInputForm />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/settings/company-profile" element={<CompanyProfileEdit />} />

      </Routes>
    </Router>
  );
};

 

export default App;
