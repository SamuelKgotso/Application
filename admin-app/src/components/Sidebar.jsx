import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/dashboard">🏠 Dashboard</Link></li>
        <li><Link to="/management">🏢 User Management</Link></li>
        <li><Link to="/users">👥 Total Users</Link></li>
        <li><Link to="/supervisor">🧑‍💼 Supervisor</Link></li>
        <li><Link to="/role/Ethics">🧑‍⚖️ Ethics</Link></li>
        <li><Link to="/role/HOD">🎓 HOD</Link></li>
        <li className="logout"><Link to="/">🚪 Logout</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
