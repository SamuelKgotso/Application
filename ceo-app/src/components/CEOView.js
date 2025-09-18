// components/CEOView.js
import React from 'react';
import './CEOView.css';

const CEOView = () => {
  // Mock data
  const applicants = [
    { id: 1, name: 'John Doe', department: 'HR', status: 'Pending', date: '2023-05-15' },
    { id: 2, name: 'Jane Smith', department: 'Finance', status: 'Approved', date: '2023-05-10' },
    { id: 3, name: 'Robert Johnson', department: 'IT', status: 'Rejected', date: '2023-05-12' },
    { id: 4, name: 'Emily Davis', department: 'Operations', status: 'Pending', date: '2023-05-14' },
  ];

  const stats = {
    totalApplicants: 124,
    hired: 42,
    rejected: 35,
    pending: 47,
    departments: 8
  };

  return (
    <div className="ceo-view">
      <h2>CEO Dashboard</h2>
      
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Applicants</h3>
          <p className="stat-number">{stats.totalApplicants}</p>
        </div>
        <div className="stat-card">
          <h3>Hired</h3>
          <p className="stat-number">{stats.hired}</p>
        </div>
        <div className="stat-card">
          <h3>Rejected</h3>
          <p className="stat-number">{stats.rejected}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number">{stats.pending}</p>
        </div>
      </div>

      <div className="ceo-sections">
        <section className="overview-section">
          <h3>Company Hiring Overview</h3>
          <div className="chart-placeholder">
            <p>Hiring metrics chart would be displayed here</p>
          </div>
        </section>

        <section className="applicants-section">
          <h3>Recent Applicants Across All Departments</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map(applicant => (
                <tr key={applicant.id}>
                  <td>{applicant.name}</td>
                  <td>{applicant.department}</td>
                  <td><span className={`status ${applicant.status.toLowerCase()}`}>{applicant.status}</span></td>
                  <td>{applicant.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default CEOView;