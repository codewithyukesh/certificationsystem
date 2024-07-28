import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './Reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/report')
      .then(response => setReports(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="reports-content">
          <h2>Reports</h2>
          <div className="report-list">
            {reports.map(report => (
              <div key={report._id} className="report-card">
                <h3>Template: {report.templateId.name}</h3>
                <p>User: {report.userId.username}</p>
                <p>Content: {report.filledContent}</p>
                <p>Date: {new Date(report.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Reports;
