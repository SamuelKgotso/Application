import React from 'react';
import './AdminView.css';

const AdminView = () => {
  // Mock data - in a real app, this would come from an API
  const applicants = [
    { id: 1, name: 'John Doe', department: 'HR', status: 'Pending', date: '2023-05-15' },
    { id: 2, name: 'Jane Smith', department: 'Finance', status: 'Approved', date: '2023-05-10' },
    { id: 3, name: 'Robert Johnson', department: 'IT', status: 'Rejected', date: '2023-05-12' },
    { id: 4, name: 'Emily Davis', department: 'Operations', status: 'Pending', date: '2023-05-14' },
  ];

  const users = [
    { id: 1, name: 'Admin User', role: 'admin', email: 'admin@company.com', lastLogin: '2023-05-15' },
    { id: 2, name: 'CEO User', role: 'ceo', email: 'ceo@company.com', lastLogin: '2023-05-14' },
    { id: 3, name: 'Ethic User', role: 'ethic', email: 'ethic@company.com', lastLogin: '2023-05-13' },
    { id: 4, name: 'Supervisor HR', role: 'supervisor', email: 'supervisor.hr@company.com', lastLogin: '2023-05-12' },
  ];

  return (
    <div className="admin-view">
      <h2>Admin Dashboard</h2>
      
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Applicants</h3>
          <p className="stat-number">124</p>
        </div>
        <div className="stat-card">
          <h3>Pending Review</h3>
          <p className="stat-number">42</p>
        </div>
        <div className="stat-card">
          <h3>System Users</h3>
          <p className="stat-number">{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Departments</h3>
          <p className="stat-number">8</p>
        </div>
      </div>

      <div className="admin-sections">
        <section className="applicants-section">
          <h3>Recent Applicants</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map(applicant => (
                <tr key={applicant.id}>
                  <td>{applicant.name}</td>
                  <td>{applicant.department}</td>
                  <td><span className={`status ${applicant.status.toLowerCase()}`}>{applicant.status}</span></td>
                  <td>{applicant.date}</td>
                  <td>
                    <button className="action-btn view">View</button>
                    <button className="action-btn edit">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="users-section">
          <h3>User Management</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>{user.lastLogin}</td>
                  <td>
                    <button className="action-btn edit">Edit</button>
                    {(user.role === 'ceo' || user.role === 'ethic' || user.role === 'supervisor') && (
                      <button className="action-btn set-password">Set Password</button>
                    )}
                    <button className="action-btn delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-user-btn">Add New User</button>
        </section>
      </div>
    </div>
  );
};

export default AdminView;