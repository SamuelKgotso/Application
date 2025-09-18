// components/EthicView.js
import React from 'react';
import './EthicView.css';

const EthicView = () => {
  // Mock data
  const applicants = [
    { id: 1, name: 'John Doe', department: 'HR', status: 'Pending', date: '2023-05-15' },
    { id: 2, name: 'Jane Smith', department: 'Finance', status: 'Approved', date: '2023-05-10' },
    { id: 3, name: 'Robert Johnson', department: 'IT', status: 'Rejected', date: '2023-05-12' },
    { id: 4, name: 'Emily Davis', department: 'Operations', status: 'Pending', date: '2023-05-14' },
  ];

  const ethicMetrics = {
    diversityScore: 82,
    complianceRate: 96,
    ethicalIssues: 3,
    reviewsCompleted: 47
  };

  return (
    <div className="ethic-view">
      <h2>Ethic Compliance Dashboard</h2>
      
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Diversity Score</h3>
          <p className="stat-number">{ethicMetrics.diversityScore}%</p>
        </div>
        <div className="stat-card">
          <h3>Compliance Rate</h3>
          <p className="stat-number">{ethicMetrics.complianceRate}%</p>
        </div>
        <div className="stat-card">
          <h3>Ethical Issues</h3>
          <p className="stat-number">{ethicMetrics.ethicalIssues}</p>
        </div>
        <div className="stat-card">
          <h3>Reviews Completed</h3>
          <p className="stat-number">{ethicMetrics.reviewsCompleted}</p>
        </div>
      </div>

      <div className="ethic-sections">
        <section className="compliance-section">
          <h3>Compliance Overview</h3>
          <div className="chart-placeholder">
            <p>Compliance metrics chart would be displayed here</p>
          </div>
        </section>

        <section className="applicants-section">
          <h3>All Applicants Review</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Date</th>
                <th>Compliance Check</th>
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
                    <span className="compliance-status compliant">Compliant</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default EthicView;