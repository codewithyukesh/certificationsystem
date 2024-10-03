// src/components/ReportTemplates.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { quickSort } from '../utils/quickSort'; // Import the QuickSort function
import './ReportTemplates.css'; // Import CSS for ReportTemplates component

const ReportTemplates = () => {
    const [reportData, setReportData] = useState([]);
    const [companyDetails, setCompanyDetails] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('templateName');
    const [sortOrder, setSortOrder] = useState('asc');
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    const fetchTemplates = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/report-templates', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReportData(response.data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    useEffect(() => {
        fetchTemplates(); // Fetch all templates on initial load

        const fetchCompanyDetails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/company');
                setCompanyDetails(response.data);
            } catch (error) {
                console.error('Error fetching company details:', error);
            }
        };

        fetchCompanyDetails(); // Fetch company details on initial load
    }, [token]); // Load templates and company details on component mount

    useEffect(() => {
        const searchTemplates = async () => {
            if (searchTerm.trim() !== '') {
                try {
                    const response = await axios.get(`http://localhost:5000/api/templates/search?templateName=${searchTerm}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (response.data.data && response.data.data.length > 0) {
                        setReportData(response.data.data);
                    } else {
                        setReportData([]);
                        toast.error('No templates found for the search criteria.');
                    }
                } catch (error) {
                    console.error('Error fetching templates:', error);
                    toast.error('An error occurred while searching for templates.');
                }
            } else {
                // Re-fetch all templates when searchTerm is empty
                fetchTemplates();
            }
        };

        searchTemplates();
    }, [searchTerm, token]); // Run this effect when the searchTerm changes

    // Updated handleSort function using QuickSort
    const handleSort = (data) => {
        const sortedData = quickSort(data, sortField, sortOrder);
        console.log( sortedData);
        return sortedData;
        
        
    };

    const filteredData = handleSort(reportData); // Use QuickSort for filtered data

    const exportToCSV = () => {
        const csvRows = [
            ['S.N.', 'Template Name', 'Created By', 'Created On'],
            ...filteredData.map((template, index) => [
                index + 1,
                template.templateName || 'N/A',
                template.createdBy || 'N/A',
                new Date(template.createdAt).toLocaleDateString() || 'N/A',
            ]),
        ];

        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'templates_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = async () => {
        const doc = new jsPDF();
        const tableColumn = ['S.N.', 'Template Name', 'Created By', 'Created On'];
        const tableRows = [];
        const logo = `http://localhost:5000${companyDetails.logo}` || '';
        const createdDate = new Date().toLocaleDateString();

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

                    // Center the company details
                    doc.setFontSize(12);
                    const textOffsetX = doc.internal.pageSize.getWidth() / 2;
                    doc.text(companyDetails.name || 'Company Name', textOffsetX, 15, { align: 'center' });
                    doc.text(companyDetails.secondaryName || 'Secondary Name', textOffsetX, 20, { align: 'center' });
                    doc.text(companyDetails.address || 'Company Address', textOffsetX, 25, { align: 'center' });
                    doc.text(`Created On: ${createdDate}`, textOffsetX, 35, { align: 'center' });
                    doc.text('Templates Report', textOffsetX, 42, { align: 'center' });
                    filteredData.forEach((template, index) => {
                        const templateData = [
                            index + 1,
                            template.templateName || 'N/A',
                            template.createdBy || 'N/A',
                            new Date(template.createdAt).toLocaleDateString() || 'N/A',
                        ];
                        tableRows.push(templateData);
                    });

                    doc.autoTable(tableColumn, tableRows, { startY: 50 });
                    doc.save('templates_report.pdf');
                };
            } catch (error) {
                console.error('Error loading image:', error);
            }
        } else {
            // Center company details without logo
            doc.setFontSize(12);
            const textOffsetX = doc.internal.pageSize.getWidth() / 2;
            doc.text(companyDetails.name || 'Company Name', textOffsetX, 15, { align: 'center' });
            doc.text(companyDetails.secondaryName || 'Secondary Name', textOffsetX, 20, { align: 'center' });
            doc.text(companyDetails.address || 'Company Address', textOffsetX, 25, { align: 'center' });
            doc.text(`Report Date: ${createdDate}`, textOffsetX, 35, { align: 'center' });

            filteredData.forEach((template, index) => {
                const templateData = [
                    index + 1,
                    template.templateName || 'N/A',
                    template.createdBy || 'N/A',
                    new Date(template.createdAt).toLocaleDateString() || 'N/A',
                ];
                tableRows.push(templateData);
            });

            doc.autoTable(tableColumn, tableRows, { startY: 50 });
            doc.save('templates_report.pdf');
        }
    };

    return (
        <div>
            <ToastContainer /> {/* Toast container for notifications */}
            <h2>Templates Report</h2>
            <input
                type="text"
                placeholder="Search by template name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <div className="sort-options">
                <select onChange={e => setSortField(e.target.value)} value={sortField}>
                    <option value="templateName">Sort by Template Name</option>
                    <option value="createdBy">Sort by Created By</option>
                </select>
                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    Sort Order {sortOrder === 'asc' ? '🔽' : '🔼'}
                </button>
            </div>
            <div className="export-buttons-container">
                <button onClick={exportToCSV} className="export-button">Export to CSV</button>
                <button onClick={exportToPDF} className="export-button">Export to PDF</button>
            </div>
            <table className="report-table">
                <thead>
                    <tr>
                        <th>S.N.</th>
                        <th>Template Name</th>
                        <th>Created By</th>
                        <th>Created On</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((template, index) => (
                            <tr key={template._id}>
                                <td>{index + 1}</td>
                                <td>{template.templateName || 'N/A'}</td>
                                <td>{template.createdBy || 'N/A'}</td>
                                <td>{new Date(template.createdAt).toLocaleDateString() || 'N/A'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No templates found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReportTemplates;
