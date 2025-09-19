// components/ApplicantModal.js
import React from 'react';
import './ApplicantModal.css';

const ApplicantModal = ({ applicant, onClose }) => {
  if (!applicant) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Applicant Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="section">
            <h3>Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Name:</label>
                <span>{applicant.sectionA?.firstNames} {applicant.sectionA?.surname}</span>
              </div>
              <div className="info-item">
                <label>ID Number:</label>
                <span>{applicant.sectionA?.identityNumber || 'N/A'}</span>
              </div>
              <div className="info-item">
                <label>Personnel Number:</label>
                <span>{applicant.sectionA?.personnelNumber || 'N/A'}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{applicant.sectionA?.email}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{applicant.sectionA?.cellPhone || applicant.sectionA?.officePhone || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Job Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Department:</label>
                <span>{applicant.sectionA?.department}</span>
              </div>
              <div className="info-item">
                <label>Branch/Cluster:</label>
                <span>{applicant.sectionA?.branch || 'N/A'}</span>
              </div>
              <div className="info-item">
                <label>Directorate/Unit:</label>
                <span>{applicant.sectionA?.unit || 'N/A'}</span>
              </div>
              <div className="info-item">
                <label>Job Title:</label>
                <span>{applicant.sectionA?.jobTitle || 'N/A'}</span>
              </div>
            </div>
          </div>

          {applicant.sectionB && (
            <div className="section">
              <h3>Working Hours & Remunerative Work</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Working Hours (per week):</label>
                  <span>{applicant.sectionB?.workingHours || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Standby Hours (per week):</label>
                  <span>{applicant.sectionB?.standbyHours || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Overtime Hours (per month):</label>
                  <span>{applicant.sectionB?.overtimeHours || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Remunerative Work Category:</label>
                  <span>{applicant.sectionB?.remunerativeWork || 'N/A'}</span>
                </div>
                {applicant.sectionB?.remunerativeWork === "Other" && (
                  <div className="info-item">
                    <label>Other Category:</label>
                    <span>{applicant.sectionB?.otherCategory || 'N/A'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {applicant.sectionC && (
            <div className="section">
              <h3>Work Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Total Monthly Hours:</label>
                  <span>{applicant.sectionC?.totalMonthlyHours || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Work Address:</label>
                  <span>{applicant.sectionC?.workAddress || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Business/Organization:</label>
                  <span>{applicant.sectionC?.businessName || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Reporting Person:</label>
                  <span>{applicant.sectionC?.reportingPerson || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Estimated Monthly Income:</label>
                  <span>{applicant.sectionC?.estimatedIncome ? `R${applicant.sectionC.estimatedIncome}` : 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {applicant.sectionD && (
            <div className="section">
              <h3>Declaration</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name:</label>
                  <span>{applicant.sectionD?.fullName || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Designation:</label>
                  <span>{applicant.sectionD?.designation || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Date:</label>
                  <span>{applicant.sectionD?.date || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="section">
            <h3>Application Status</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Status:</label>
                <span className={`status ${applicant.status?.toLowerCase() || 'pending'}`}>
                  {applicant.status || 'Pending'}
                </span>
              </div>
              <div className="info-item">
                <label>Submitted On:</label>
                <span>{applicant.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="action-btn evaluate">Evaluate Application</button>
          <button className="action-btn close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantModal;