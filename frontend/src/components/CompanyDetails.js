import React, { useEffect, useState } from 'react';
import './CompanyDetails.css';

const CompanyDetails = () => {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/company');
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    fetchCompanyDetails();
  }, []);

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="company-details">
      <h3>Company Details</h3>
      <p><strong>Name:</strong> {company.name}</p>
      <p><strong>Address:</strong> {company.address}</p>
    </div>
  );
};

export default CompanyDetails;
