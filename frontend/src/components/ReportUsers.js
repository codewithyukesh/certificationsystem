import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './ReportUsers.css'; // Import CSS for ReportUsers component

const ReportUsers = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [companyDetails, setCompanyDetails] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('username');
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLoggedInUser(response.data);
            } catch (error) {
                console.error('Error fetching logged-in user:', error);
                setError('Failed to load logged-in user data.');
            }
        };
        fetchLoggedInUser();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!loggedInUser) return;

            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/auth/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const users = loggedInUser.role === 'user'
                    ? response.data.filter(user => user._id === loggedInUser._id)
                    : response.data;
                setReportData(users);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to load users.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [loggedInUser]);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/company');
                setCompanyDetails(response.data);
            } catch (error) {
                console.error('Error fetching company details:', error);
                setError('Failed to load company details.');
            }
        };
        fetchCompanyDetails();
    }, []);

    const handleSearch = (data) => {
        if (!searchTerm) return data;

        return data.filter(user => {
            const term = searchTerm.toLowerCase();
            return (user.username && user.username.toLowerCase().includes(term)) ||
                   (user.email && user.email.toLowerCase().includes(term)) ||
                   (user.fullName && user.fullName.toLowerCase().includes(term)); // Add full name search
        });
    };

    const handleSort = (data) => {
        return data.sort((a, b) => {
            const fieldA = a[sortField] ? a[sortField].toLowerCase() : '';
            const fieldB = b[sortField] ? b[sortField].toLowerCase() : '';
            return sortOrder === 'asc' ? (fieldA < fieldB ? -1 : 1) : (fieldA > fieldB ? -1 : 1);
        });
    };

    const filteredData = handleSort(handleSearch(reportData));

    const exportToCSV = () => {
        const csvRows = [
            ['S.N.', 'Full Name', 'Username', 'Email', 'Role'], // Updated header row
            ...filteredData.map((user, index) => [
                index + 1,
                user.fullName || 'N/A', // Include full name
                user.username || 'N/A',
                user.email || 'N/A',
                user.role || 'N/A',
            ]),
        ];

        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'users_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = async () => {
        const doc = new jsPDF();
        const tableColumn = ['S.N.', 'Full Name', 'Username', 'Email', 'Role']; // Updated column names
        const tableRows = [];
        const logo = `http://localhost:5000${companyDetails.logo}` || '';
        const createdDate = new Date().toLocaleDateString();

        // Attempt to load the logo
        if (logo) {
            try {
                const response = await axios.get(logo, { responseType: 'blob' });
                const reader = new FileReader();
                reader.readAsDataURL(response.data);
                reader.onloadend = () => {
                    const base64Image = reader.result;
                    const logoWidth = 30 / 2; // Original width was 30, so 50% is 15
                    const logoHeight = 30 / 2; // Original height was 30, so 50% is 15
                    doc.addImage(base64Image, 'PNG', 55, 12, logoWidth, logoHeight);
                    generatePDFContent(doc, tableColumn, tableRows, createdDate);
                };
            } catch (error) {
                console.error('Error loading image:', error);
            }
        } else {
            generatePDFContent(doc, tableColumn, tableRows, createdDate);
        }
    };

    const generatePDFContent = (doc, tableColumn, tableRows, createdDate) => {
        const textOffsetX = doc.internal.pageSize.getWidth() / 2;

        // Center the company details
        doc.setFontSize(12);
        doc.text(companyDetails.name, textOffsetX, 15, { align: 'center' });
        doc.text(companyDetails.secondaryName, textOffsetX, 20, { align: 'center' });
        doc.text(companyDetails.address, textOffsetX, 25, { align: 'center' });
        doc.text(`Created On: ${createdDate}`, textOffsetX, 35, { align: 'center' });
        doc.text('Users Report', textOffsetX, 42, { align: 'center' });

        // Populate the table rows with user data
        filteredData.forEach((user, index) => {
            const userData = [
                index + 1,
                user.fullName || 'N/A', // Include full name
                user.username || 'N/A',
                user.email || 'N/A',
                user.role || 'N/A',
            ];
            tableRows.push(userData);
        });

        // Add table to the PDF
        doc.autoTable(tableColumn, tableRows, { startY: 45 });
        doc.save('users_report.pdf');
    };

    return (
        <div>
            <h2>Users Report</h2>
            <input
                type="text"
                placeholder="Search by username, email, or full name..."
                className="search-input"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="sort-options">
                <select onChange={e => setSortField(e.target.value)} value={sortField}>
                    <option value="username">Sort by Username</option>
                    <option value="email">Sort by Email</option>
                    <option value="role">Sort by Role</option>
                    <option value="fullName">Sort by Full Name</option> {/* Add sort option for full name */}
                </select>
                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    Sort Order {sortOrder === 'asc' ? '🔽' : '🔼'}
                </button>
            </div>
            <div className="export-buttons-container">
                <button onClick={exportToCSV} className="export-button">Export to CSV</button>
                <button onClick={exportToPDF} className="export-button">Export to PDF</button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : filteredData.length > 0 ? (
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>S.N.</th>
                            <th>Full Name</th> {/* Add Full Name header */}
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.fullName || 'N/A'}</td> {/* Include full name */}
                                <td>{user.username || 'N/A'}</td>
                                <td>{user.email || 'N/A'}</td>
                                <td>{user.role || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default ReportUsers;
