// components/EthicView.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the import path as needed
import ApplicantModal from './ApplicantModal'; // Import the modal
import './EthicView.css';

const EthicView = () => {
  const [applicants, setApplicants] = useState([]);
  const [ethicMetrics, setEthicMetrics] = useState({
    diversityScore: 0,
    complianceRate: 0,
    ethicalIssues: 0,
    reviewsCompleted: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null); // For modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all applicants data (no department filter)
        const applicantsQuery = collection(db, 'applicant');
        const applicantsSnapshot = await getDocs(applicantsQuery);
        const applicantsData = [];
        
        applicantsSnapshot.forEach((doc) => {
          applicantsData.push({ id: doc.id, ...doc.data() });
        });
        
        setApplicants(applicantsData);
        
        // Calculate ethic metrics
        const totalApplicants = applicantsData.length;
        const approvedApplicants = applicantsData.filter(app => app.status === 'Approved').length;
        const rejectedApplicants = applicantsData.filter(app => app.status === 'Rejected').length;
        
        // These calculations are just examples - adjust based on your actual data structure
        const diversityScore = calculateDiversityScore(applicantsData);
        const complianceRate = calculateComplianceRate(applicantsData);
        const ethicalIssues = countEthicalIssues(applicantsData);
        
        setEthicMetrics({
          diversityScore,
          complianceRate,
          ethicalIssues,
          reviewsCompleted: approvedApplicants + rejectedApplicants
        });
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Example calculation functions - adjust based on your actual data structure
  const calculateDiversityScore = (applicants) => {
    // This is a simplified example - implement your actual diversity calculation
    const departments = [...new Set(applicants.map(app => app.sectionA?.department))];
    return Math.min(100, Math.floor((departments.length / 10) * 100));
  };

  const calculateComplianceRate = (applicants) => {
    // This is a simplified example - implement your actual compliance calculation
    const compliantApps = applicants.filter(app => 
      app.sectionA && app.sectionB && app.sectionC
    );
    return compliantApps.length > 0 
      ? Math.floor((compliantApps.length / applicants.length) * 100)
      : 95; // Default value
  };

  const countEthicalIssues = (applicants) => {
    // This is a simplified example - implement your actual ethical issues counting
    return applicants.filter(app => 
      app.ethicalConcerns && app.ethicalConcerns.length > 0
    ).length;
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="supervisor-view"> {/* Changed to supervisor-view for consistent styling */}
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

      <div className="supervisor-sections"> {/* Changed to supervisor-sections for consistent styling */}
        <section className="applicants-section">
          <h3>All Applicants Review</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
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
                  <td>{applicant.sectionA?.department || 'N/A'}</td>
                  <td>{applicant.sectionA?.jobTitle || 'N/A'}</td>
                  <td>
                    <span className={`status ${(applicant.status || 'Pending').toLowerCase()}`}>
                      {applicant.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    {applicant.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                  </td>
                  <td>
                    <button 
                      className="action-btn view" 
                      onClick={() => setSelectedApplicant(applicant)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* Add the modal */}
      <ApplicantModal 
        applicant={selectedApplicant} 
        onClose={() => setSelectedApplicant(null)} 
      />
    </div>
  );
};

export default EthicView;