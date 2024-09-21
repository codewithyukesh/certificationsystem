import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './Dashboard.css';

// Register all chart.js components
Chart.register(...registerables);

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [issuedTemplates, setIssuedTemplates] = useState(0);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [issuedData, setIssuedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      setLoading(true);
      try {
        const userResponse = await axios.get('http://localhost:5000/api/report-users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalUsers(userResponse.data.length);

        const templateResponse = await axios.get('http://localhost:5000/api/templates', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const templates = templateResponse.data;
        setTotalTemplates(templates.length);

        const issuedResponse = await axios.get('http://localhost:5000/api/issued-templates/result', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const issuedTemplatesData = issuedResponse.data;
        setIssuedTemplates(issuedTemplatesData.length);

        const issuedCounts = {};
        issuedTemplatesData.forEach(template => {
          const title = template.templateTitle; 
          issuedCounts[title] = (issuedCounts[title] || 0) + 1;
        });
        setIssuedData(issuedCounts);
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const overallData = {
    labels: ['Total Users', 'Total Templates', 'Issued Templates'],
    datasets: [
      {
        label: 'Counts',
        data: [totalUsers, totalTemplates, issuedTemplates],
        backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(153,102,255,0.6)', 'rgba(255,159,64,0.6)'],
        borderColor: ['rgba(75,192,192,1)', 'rgba(153,102,255,1)', 'rgba(255,159,64,1)'],
        borderWidth: 1,
      },
    ],
  };

  const issuedLabels = Object.keys(issuedData);
  const issuedCounts = Object.values(issuedData);

  const issuedChartData = {
    labels: issuedLabels.length > 0 ? issuedLabels : ['No Data'],
    datasets: [
      {
        label: 'Issued Templates',
        data: issuedCounts.length > 0 ? issuedCounts : [0],
        backgroundColor: 'rgba(255,99,132,0.6)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
      },
    ],
  };

  const issuedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || 'No Data';
            const count = context.raw;
            return `${label}: ${count}`;
          },
        },
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
        title: {
          display: true,
          text: 'Counts',
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content">
          <h2>Welcome to the Dashboard</h2>

          <div className="quick-links">
            <h3>Quick Links</h3>
            <Link to="/add-template">
              <button>Create New Template</button>
            </Link>
            <Link to="/reports">
              <button>View Reports</button>
            </Link>
            <Link to="/manage-users">
              <button>Manage Users</button>
            </Link>
          </div>

          <div className="metrics">
            <div className="metric-card">
              <h3>Total Users</h3>
              <p>{totalUsers}</p>
            </div>
            <div className="metric-card">
              <h3>Total Templates</h3>
              <p>{totalTemplates}</p>
            </div>
            <div className="metric-card">
              <h3>Issued Templates</h3>
              <p>{issuedTemplates}</p>
            </div>
          </div>

          <div className="charts-wrapper">
            <div className="chart-container">
              <h3>Overall Metrics</h3>
              <Bar data={overallData} options={{ maintainAspectRatio: false, responsive: true }} />
            </div>

            <div className="chart-container">
              <h3>Issued Templates by Name</h3>
              <Bar data={issuedChartData} options={issuedChartOptions} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
