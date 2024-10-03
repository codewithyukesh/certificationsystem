import React, { useState } from 'react';
import Header from './Header'; // Import Header
import Sidebar from './Sidebar'; // Import Sidebar
import Footer from './Footer'; // Import Footer
import ReportUsers from './ReportUsers'; // Import ReportUsers component
import ReportTemplates from './ReportTemplates'; // Import ReportTemplates component
import ReportSavedTemplates from './ReportSavedTemplates'; // Import ReportSavedTemplates component
import './Reports.css'; // Import CSS for Reports component

const Reports = () => {
    const [selectedReportType, setSelectedReportType] = useState('savedtemplates');

    const renderReportComponent = () => {
        switch (selectedReportType) {
            case 'users':
                return <ReportUsers />;
            case 'savedtemplates':
                return <ReportSavedTemplates />;
            case 'ReportTemplates':
            default:
                return <ReportTemplates />;
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="report-buttons">
                <button onClick={() => setSelectedReportType('templates')} className="report-button">Templates</button>
                <button onClick={() => setSelectedReportType('savedtemplates')} className="report-button">Saved Templates</button>
    <button onClick={() => setSelectedReportType('users')} className="report-button">Users</button>
</div>

                <div className="report-content">
                    {renderReportComponent()}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Reports;
