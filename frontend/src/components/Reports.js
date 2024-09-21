import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv'; // For CSV export
import axios from 'axios';
import Header from './Header'; // Import Header
import Sidebar from './Sidebar'; // Import Sidebar
import Footer from './Footer'; // Import Footer
import './Reports.css'; // Import CSS for Reports component

const Reports = () => {
    const [reportData, setReportData] = useState([]);
    const [selectedReportType, setSelectedReportType] = useState('savedtemplates');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
    const [isAdmin, setIsAdmin] = useState(true); // Replace with real admin check
    const [userId, setUserId] = useState(''); // Replace with real user ID
    const [users, setUsers] = useState({}); // To map userId to usernames

    useEffect(() => {
        fetchData();
        if (isAdmin) fetchUsers();
    }, [selectedReportType, userId, isAdmin]);

    const fetchData = async () => {
        try {
            let endpoint;
            if (selectedReportType === 'templates') {
                endpoint = 'http://localhost:5000/api/report-templates';
            } else if (selectedReportType === 'savedtemplates') {
                endpoint = 'http://localhost:5000/api/report-saved-templates';
            } else if (selectedReportType === 'users' && isAdmin) {
                endpoint = 'http://localhost:5000/api/report-users';
            } else {
                return; // User is not admin and tried to access user reports
            }

            const response = await axios.get(endpoint, {
                params: isAdmin ? {} : { userId }
            });
            setReportData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users');
            const usersData = response.data.reduce((acc, user) => {
                acc[user._id] = user.username;
                return acc;
            }, {});
            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSearch = (data) => {
        if (!searchTerm) return data;

        return data.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    };

    const handleDateFilter = (data) => {
        if (!dateFilter.startDate || !dateFilter.endDate) return data;

        return data.filter(item => {
            const date = new Date(item.savedAt); // Adjust according to your date field
            return date >= new Date(dateFilter.startDate) && date <= new Date(dateFilter.endDate);
        });
    };

    const filteredData = handleDateFilter(handleSearch(reportData));
    const totalIssuedTemplates = filteredData.length;

    const headers = [
        { label: 'S.N.', key: 'sNo' },
        { label: 'Title', key: 'templateTitle' },
        { label: 'Description', key: 'templateDescription' },
        { label: 'Issued By', key: 'username' },
        { label: 'Issued On', key: 'savedAt' }
    ];

    const handleExportPDF = (data, headers) => {
        // Implement PDF export logic
        console.log('Export PDF not implemented yet.');
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="settings-content">
                    <div className="filters-container">
                        <div className="filter-row">
                            <select
                                className="dropdown"
                                value={selectedReportType}
                                onChange={e => setSelectedReportType(e.target.value)}
                            >
                                <option value="savedtemplates">Saved Templates</option>
                                {isAdmin && <option value="templates">Templates</option>}
                                {isAdmin && <option value="users">Users</option>}
                            </select>
                            <div className="export-buttons">
                                <CSVLink
                                    data={filteredData}
                                    headers={headers}
                                    filename={`report_${selectedReportType}.csv`}
                                    className="export-button export-csv"
                                >
                                    Export CSV
                                </CSVLink>
                                <button
                                    className="export-button export-pdf"
                                    onClick={() => handleExportPDF(filteredData, headers)}
                                >
                                    Export PDF
                                </button>
                            </div>
                        </div>
                        <div className="filter-row">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="search-input"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <input
                                type="date"
                                className="date-filter"
                                value={dateFilter.startDate}
                                onChange={e => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                            />
                            <input
                                type="date"
                                className="date-filter"
                                value={dateFilter.endDate}
                                onChange={e => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="report-summary">
                        <p>Total Issued Templates: {totalIssuedTemplates}</p>
                    </div>
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>S.N.</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Issued By</th>
                                <th>Issued On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.templateTitle || 'N/A'}</td>
                                    <td>{item.templateDescription || 'N/A'}</td>
                                    <td>{item.username ? item.username : 'Unknown'}</td> {/* Access the populated username */}
                                    <td>{item.savedAt ? new Date(item.savedAt).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Reports;
