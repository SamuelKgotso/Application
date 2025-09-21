// components/Header.js
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="header-left">
        <h1>Rwops Dashboard</h1>
      </div>
      <div className="header-right">
        <span className="user-info">
          Welcome, {user.username} ({user.role}
          {user.department && `, ${user.department}`})
        </span>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;