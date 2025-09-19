// components/SupervisorView.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Adjust import path as needed
import './SupervisorView.css';

const SupervisorView = ({ department }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        // Query applicants where sectionA.department matches the supervisor's department
        const q = query(
          collection(db, 'applicant'),
          where('sectionA.department', '==', department)
        );
        const querySnapshot = await getDocs(q);
        const applicantsData = [];
        querySnapshot.forEach((doc) => {
          applicantsData.push({ id: doc.id, ...doc.data() });
        });
        setApplicants(applicantsData);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [department]);

  // Calculate stats from real data
  const departmentStats = {
    totalApplicants: applicants.length,
    hired: applicants.filter(app => app.status === 'Approved').length,
    rejected: applicants.filter(app => app.status === 'Rejected').length,
    pending: applicants.filter(app => app.status === 'Pending').length,
    openPositions: 5 // You might need to fetch this from another collection
  };

  if (loading) {
    return <div>Loading applicants...</div>;
  }

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
                  <td>{applicant.sectionA?.firstNames} {applicant.sectionA?.surname}</td>
                  <td>{applicant.sectionA?.jobTitle}</td>
                  <td>
                    <span className={`status ${applicant.status?.toLowerCase()}`}>
                      {applicant.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    {applicant.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                  </td>
                  <td>
                    <button className="action-btn view">View</button>
                    <button className="action-btn evaluate">Evaluate</button>
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

export default SupervisorView;