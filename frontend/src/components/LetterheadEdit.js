    // src/components/LetterheadEdit.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './LetterheadEdit.css';

const LetterheadEdit = () => {
  const { id } = useParams();
  const [letterhead, setLetterhead] = useState(null);
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [secondaryName, setSecondaryName] = useState('');
  const [address, setAddress] = useState('');
  const [refNo, setRefNo] = useState('');
  const [dispatchNo, setDispatchNo] = useState('');
  const [footer, setFooter] = useState({
    contactDetails: { phone: '', email: '', website: '' },
    tagline: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLetterhead = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/letterheads/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLetterhead(response.data);
        setName(response.data.name);
        setLogo(response.data.logo);
        setCompanyName(response.data.companyName);
        setSecondaryName(response.data.secondaryName || '');
        setAddress(response.data.address || '');
        setRefNo(response.data.refNo || '');
        setDispatchNo(response.data.dispatchNo || '');
        setFooter(response.data.footer || { contactDetails: { phone: '', email: '', website: '' }, tagline: '' });
      } catch (error) {
        console.error('Error fetching letterhead:', error.response ? error.response.data : error.message);
      }
    };

    fetchLetterhead();
  }, [id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/api/letterheads/${id}`,
        { name, logo, companyName, secondaryName, address, refNo, dispatchNo, footer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Letterhead updated successfully!');
      navigate('/manage-letterheads');
    } catch (error) {
      console.error('Error updating letterhead:', error.response ? error.response.data : error.message);
    }
  };

  if (!letterhead) return <div>Loading...</div>;

  return (
    <div className="letterhead-edit">
      <h2>Edit Letterhead</h2>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Logo URL:
        <input type="text" value={logo} onChange={(e) => setLogo(e.target.value)} />
      </label>
      <label>
        Company Name:
        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
      </label>
      <label>
        Secondary Name:
        <input type="text" value={secondaryName} onChange={(e) => setSecondaryName(e.target.value)} />
      </label>
      <label>
        Address:
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </label>
      <label>
        Ref No:
        <input type="text" value={refNo} onChange={(e) => setRefNo(e.target.value)} />
      </label>
      <label>
        Dispatch No:
        <input type="text" value={dispatchNo} onChange={(e) => setDispatchNo(e.target.value)} />
      </label>
      <label>
        Footer Contact Details:
        <label>
          Phone:
          <input type="text" value={footer.contactDetails.phone} onChange={(e) => setFooter(prev => ({ ...prev, contactDetails: { ...prev.contactDetails, phone: e.target.value } }))} />
        </label>
        <label>
          Email:
          <input type="text" value={footer.contactDetails.email} onChange={(e) => setFooter(prev => ({ ...prev, contactDetails: { ...prev.contactDetails, email: e.target.value } }))} />
        </label>
        <label>
          Website:
          <input type="text" value={footer.contactDetails.website} onChange={(e) => setFooter(prev => ({ ...prev, contactDetails: { ...prev.contactDetails, website: e.target.value } }))} />
        </label>
      </label>
      <label>
        Footer Tagline:
        <input type="text" value={footer.tagline} onChange={(e) => setFooter(prev => ({ ...prev, tagline: e.target.value }))} />
      </label>
      <label>
        <input type="checkbox" checked={letterhead.isActive} onChange={(e) => setLetterhead(prev => ({ ...prev, isActive: e.target.checked }))} />
        Active
      </label>
      <button onClick={handleUpdate}>Update Letterhead</button>
    </div>
  );
};

export default LetterheadEdit;
