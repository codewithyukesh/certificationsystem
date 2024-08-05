import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import TemplateInputForm from './components/TemplateInputForm'; // Import the new component
import FiscalYear from './components/FiscalYear';
import SupportPage from './components/SupportPage';
import LetterheadList from './components/LetterheadList';
import LetterheadForm from './components/LetterheadForm'; // Import the new form component
import LetterheadView from './components/LetterheadView';

const App = () => {
  const token = localStorage.getItem('token'); // Get the token from localStorage

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/company-profile" element={<CompanyProfileEdit />} />
        <Route path="/settings/fiscal-year" element={<FiscalYear />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/create-template" element={<CreateTemplate />} />
        <Route path="/add-template" element={<AddTemplate />} />
        <Route path="/templates/list" element={<TemplateList />} />
        <Route path="/templates/add" element={<AddTemplate />} />
        <Route path="/templates/:id" element={<TemplateView />} />
        <Route path="/templates/edit/:id" element={<TemplateEdit />} />
        <Route path="/user/templates" element={<UserTemplateSelection />} />
        <Route path="/user/template/edit/:id" element={<UserTemplateEditor />} />
        <Route path="/preview-template/:id" element={<TemplateInputForm />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/letterhead-list" element={<LetterheadList />} /> {/* Updated path */}
        <Route path="/letterhead/add" element={<LetterheadForm />} /> {/* Add route for adding letterhead */}
        <Route path="/letterhead/edit/:id" element={<LetterheadForm />} /> {/* Add route for editing letterhead */}
        <Route path="/letterhead/view/:id" element={<LetterheadView />} />
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
