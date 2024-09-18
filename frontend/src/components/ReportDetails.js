import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './ReportDetails.css'; // Ensure styles are consistent

const ReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState({
        title: '',
        description: '',
        issuedBy: '',
        templateId: '',
        savedTemplateId: '',
        issuedOn: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [savedTemplates, setSavedTemplates] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [userRes, templateRes, savedTemplateRes] = await Promise.all([
                    axios.get('/users'),
                    axios.get('/templates'),
                    axios.get('/savedtemplates')
                ]);
                setUsers(userRes.data);
                setTemplates(templateRes.data);
                setSavedTemplates(savedTemplateRes.data);

                if (id) {
                    const reportRes = await axios.get(`/reports/${id}`);
                    setReport(reportRes.data);
                }
            } catch (err) {
                setError('Failed to fetch data.');
            }
            setLoading(false);
        };
        fetchInitialData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReport((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await axios.put(`/reports/${id}`, report);
            } else {
                await axios.post('/reports', report);
            }
            navigate('/reports');
        } catch (err) {
            setError('Failed to save report.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="report-details-content">
                    <h1>{id ? 'Edit Report' : 'Create Report'}</h1>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Title:</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={report.title} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea 
                                name="description" 
                                value={report.description} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label>Issued By:</label>
                            <select 
                                name="issuedBy" 
                                value={report.issuedBy} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Select User</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Template:</label>
                            <select 
                                name="templateId" 
                                value={report.templateId} 
                                onChange={handleChange}
                            >
                                <option value="">Select Template</option>
                                {templates.map(template => (
                                    <option key={template._id} value={template._id}>{template.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Saved Template:</label>
                            <select 
                                name="savedTemplateId" 
                                value={report.savedTemplateId} 
                                onChange={handleChange}
                            >
                                <option value="">Select Saved Template</option>
                                {savedTemplates.map(savedTemplate => (
                                    <option key={savedTemplate._id} value={savedTemplate._id}>{savedTemplate.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Issued On:</label>
                            <input 
                                type="date" 
                                name="issuedOn" 
                                value={report.issuedOn.split('T')[0]} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <button type="submit" disabled={loading}>{id ? 'Update' : 'Create'} Report</button>
                        {error && <p>{error}</p>}
                    </form>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default ReportDetails;
