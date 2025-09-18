// components/Sidebar.js
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <h3>Navigation</h3>
        <ul>
          <li><a href="#overview">Overview</a></li>
          <li><a href="#applicants">Applicants</a></li>
          {(user.role === 'admin' || user.role === 'ceo' || user.role === 'ethic') && (
            <li><a href="#reports">Reports</a></li>
          )}
          {user.role === 'admin' && (
            <>
              <li><a href="#users">User Management</a></li>
              <li><a href="#settings">System Settings</a></li>
            </>
          )}
          <li><a href="#help">Help & Support</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;