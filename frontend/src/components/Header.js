import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="fiscal-year">Fiscal Year: 2024</div>
      <div className="user-profile">
        <span>Logged in as: User</span>
        <button className="profile-button">Profile</button>
      </div>
    </header>
  );
};

export default Header;
