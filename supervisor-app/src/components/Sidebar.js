import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Supervisor</h2>
      <ul>
        <li><Link to="/">🏠 Dashboard</Link></li>
        <li><Link to="/userlist">🏢 Departments</Link></li>
        <li><Link to="/users">👥 Total Users</Link></li>
        <li><Link to="/supervisor">🧑‍💼 Supervisor</Link></li>
        <li><Link to="/role/Ethics">🧑‍⚖️ Status</Link></li>
        <li><Link to="/role/HOD">🎓 Result</Link></li>
        <li className="logout"><Link to="/">🚪 Logout</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
