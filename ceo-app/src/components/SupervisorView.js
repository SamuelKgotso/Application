// components/SupervisorView.js
import React from 'react';
import './SupervisorView.css';

const SupervisorView = ({ department }) => {
  // Mock data filtered by department
  const applicants = [
    { id: 1, name: 'John Doe', position: 'HR Specialist', status: 'Pending', date: '2023-05-15' },
    { id: 2, name: 'Alice Johnson', position: 'Recruiter', status: 'Approved', date: '2023-05-10' },
    { id: 3, name: 'Michael Brown', position: 'Training Coordinator', status: 'Rejected', date: '2023-05-12' },
  ];

  const departmentStats = {
    totalApplicants: 24,
    hired: 8,
    rejected: 6,
    pending: 10,
    openPositions: 5
  };

  return (
    <div className="supervisor-view">
      <h2>{department} Department Dashboard</h2>
      
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Applicants</h3>
          <p className="stat-number">{departmentStats.totalApplicants}</p>
        </div>
        <div className="stat-card">
          <h3>Hired</h3>
          <p className="stat-number">{departmentStats.hired}</p>
        </div>
        <div className="stat-card">
          <h3>Rejected</h3>
          <p className="stat-number">{departmentStats.rejected}</p>
        </div>
        <div className="stat-card">
          <h3>Open Positions</h3>
          <p className="stat-number">{departmentStats.openPositions}</p>
        </div>
      </div>

      <div className="supervisor-sections">
        <section className="department-section">
          <h3>Department Hiring Overview</h3>
          <div className="chart-placeholder">
            <p>Department hiring metrics chart would be displayed here</p>
          </div>
        </section>

        <section className="applicants-section">
          <h3>Applicants for {department} Department</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map(applicant => (
                <tr key={applicant.id}>
                  <td>{applicant.name}</td>
                  <td>{applicant.position}</td>
                  <td><span className={`status ${applicant.status.toLowerCase()}`}>{applicant.status}</span></td>
                  <td>{applicant.date}</td>
                  <td>
                    <button className="action-btn view">View</button>
                    <button className="action-btn evaluate">Evaluate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-applicant-btn">Add New Applicant</button>
        </section>
      </div>
    </div>
  );
};

export default SupervisorView;