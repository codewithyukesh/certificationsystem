import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './ReportSavedTemplates.css'; // Import CSS for ReportSavedTemplates component

const ReportSavedTemplates = () => {
    const [reportData, setReportData] = useState([]);
    const [companyDetails, setCompanyDetails] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('templateTitle');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        const fetchSavedTemplates = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/report-saved-templates');
                setReportData(response.data);
            } catch (error) {
                console.error('Error fetching saved templates:', error);
            }
        };

        const fetchCompanyDetails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/company');
                setCompanyDetails(response.data);
            } catch (error) {
                console.error('Error fetching company details:', error);
            }
        };

        fetchSavedTemplates();
        fetchCompanyDetails();
    }, []);

    const handleSearch = (data) => {
        if (!searchTerm) return data;
        return data.filter(template =>
            template.templateTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
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
            ['S.N.', 'Template Title', 'Description', 'Saved By', 'Saved On'],
            ...filteredData.map((savedTemplate, index) => [
                index + 1,
                savedTemplate.templateTitle || 'N/A',
                savedTemplate.templateDescription || 'N/A',
                savedTemplate.savedBy || 'N/A',
                new Date(savedTemplate.savedAt).toLocaleDateString() || 'N/A',
            ]),
        ];

        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'saved_templates_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = async () => {
        const doc = new jsPDF();
        const tableColumn = ['S.N.', 'Template Title', 'Description', 'Saved By', 'Saved On'];
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
                    doc.text('Saved Templates Report', textOffsetX, 42, { align: 'center' });
                    filteredData.forEach((savedTemplate, index) => {
                        const templateData = [
                            index + 1,
                            savedTemplate.templateTitle || 'N/A',
                            savedTemplate.templateDescription || 'N/A',
                            savedTemplate.savedBy || 'N/A',
                            new Date(savedTemplate.savedAt).toLocaleDateString() || 'N/A',
                        ];
                        tableRows.push(templateData);
                    });

                    doc.autoTable(tableColumn, tableRows, { startY: 60 });
                    doc.save('saved_templates_report.pdf');
                };
            } catch (error) {
                console.error('Error loading image:', error);
            }
        } else {
            // Center company details without logo
            doc.setFontSize(12);
            const textOffsetX = doc.internal.pageSize.getWidth() / 2;
            doc.text(companyDetails.name || 'Company Name', textOffsetX, 20, { align: 'center' });
            doc.text(companyDetails.secondaryName || 'Secondary Name', textOffsetX, 25, { align: 'center' });
            doc.text(companyDetails.address || 'Company Address', textOffsetX, 30, { align: 'center' });
            doc.text(`Created On: ${createdDate}`, textOffsetX, 40, { align: 'center' });

            filteredData.forEach((savedTemplate, index) => {
                const templateData = [
                    index + 1,
                    savedTemplate.templateTitle || 'N/A',
                    savedTemplate.templateDescription || 'N/A',
                    savedTemplate.savedBy || 'N/A',
                    new Date(savedTemplate.savedAt).toLocaleDateString() || 'N/A',
                ];
                tableRows.push(templateData);
            });

            doc.autoTable(tableColumn, tableRows, { startY: 60 });
            doc.save('saved_templates_report.pdf');
        }
    };

    return (
        <div>
            <h2>Saved Templates Report</h2>
            <input
                type="text"
                placeholder="Search by template title..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <div className="sort-options">
                <select onChange={e => setSortField(e.target.value)} value={sortField}>
                    <option value="templateTitle">Sort by Template Title</option>
                    <option value="savedBy">Sort by Saved By</option>
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
                        <th>Template Title</th>
                        <th>Description</th>
                        <th>Saved By</th>
                        <th>Saved On</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((savedTemplate, index) => (
                        <tr key={savedTemplate._id}>
                            <td>{index + 1}</td>
                            <td>{savedTemplate.templateTitle || 'N/A'}</td>
                            <td>{savedTemplate.templateDescription || 'N/A'}</td>
                            <td>{savedTemplate.savedBy || 'N/A'}</td>
                            <td>{new Date(savedTemplate.savedAt).toLocaleDateString() || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportSavedTemplates;
