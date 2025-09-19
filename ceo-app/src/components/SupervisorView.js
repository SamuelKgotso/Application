// components/SupervisorView.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import ApplicantModal from './ApplicantModal'; // Import the modal
import './SupervisorView.css';


const SupervisorView = ({ department }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null); // For modal

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
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

  const departmentStats = {
    totalApplicants: applicants.length,
    hired: applicants.filter(app => app.status === 'Approved').length,
    rejected: applicants.filter(app => app.status === 'Rejected').length,
    pending: applicants.filter(app => !app.status || app.status === 'Pending').length,
    openPositions: 5
  };

  if (loading) {
    return <div>Loading applicants...</div>;
  }

  return (
    <div className="supervisor-view">
      <h2>{department} Department Dashboard</h2>
      
      <div className="stats-cards">
        {/* ... stats cards code ... */}
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
                    <span className={`status ${applicant.status?.toLowerCase() || 'pending'}`}>
                      {applicant.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    {applicant.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                  </td>
                  <td>
                    {/* Update the View button to open the modal */}
                    <button 
                      className="action-btn view" 
                      onClick={() => setSelectedApplicant(applicant)}
                    >
                      View
                    </button>
                    <br/>
                    <button className="action-btn evaluate">Evaluate</button>
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

export default SupervisorView;