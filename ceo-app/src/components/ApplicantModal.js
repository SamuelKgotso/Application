// components/ApplicantModal.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './ApplicantModal.css';

const ApplicantModal = ({ applicant, onClose }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [declarationItems, setDeclarationItems] = useState([]);
  
  useEffect(() => {
    if (applicant?.sectionC) {
      const days = [
        { day: 'Monday', hours: applicant.sectionC.monday },
        { day: 'Tuesday', hours: applicant.sectionC.tuesday },
        { day: 'Wednesday', hours: applicant.sectionC.wednesday },
        { day: 'Thursday', hours: applicant.sectionC.thursday },
        { day: 'Friday', hours: applicant.sectionC.friday },
        { day: 'Saturday', hours: applicant.sectionC.saturday },
        { day: 'Sunday', hours: applicant.sectionC.sunday },
      ].filter(day => day.hours); // Only show days with hours
      setDaysOfWeek(days);
    }
  }, [applicant]);

  useEffect(() => {
    if (applicant?.sectionD) {
      // Define all declaration items with their text
      const step1Items = [
        "The information supplied in this application form is accurate and truthful;",
        "My performance of other remunerative work will in no way interfere with my commitments to the department, my duties and responsibilities as an employee;",
        "My performance of other remunerative work will not take place during the hours I am required for duty as agreed in my employment contract;",
        "I will not use any state resources for the purpose of performing other remunerative work;",
        "I shall not conduct business with any organ of the state, either in person or as part of an entity (including non-profit organisations);",
        "I will only be involved in the other remunerative work I have applied for; and",
        "This application has been discussed with my supervisor.",
        "External work details: The nature of external work, hours per week/month, estimated income, and work address",
      ];

      const step2Items = [
        "My first commitment is to meet the operational objectives of my department and undertake to assist, to the best of my ability, the department in meeting its service delivery demands, including overtime commitments (if applicable) and being on call/standby (when applicable) as scheduled.",
        "Permission to perform other remunerative work is only granted for the work applied for and time agreed upon (and reflected on the certificate of approval);",
        "Should I wish to continue with such other remunerative work, I must submit a new application at least sixty (60) days before expiry of the approved one;",
        "Non-compliance with any of the conditions, monitoring or control measures pertaining to other remunerative work may lead to revocation, disciplinary action, and/or legal proceedings and that the sanction imposed may include forfeiture of other remunerative work approval, remuneration and/or benefits gained;",
        "The normal policies and measures governing discipline also apply in terms of non-compliance with the other remunerative work policy and measures;",
        "The Executive Authority or delegated authority can, at any time, terminate my authorisation to perform other remunerative work, based on a change in operational requirements and/or poor performance on my part.",
        "Abide by any control measures applicable to the other remunerative work system, including that it may be required of me to sign in and out each time I enter or exit the institution where I perform my basic or overtime duties;",
        "Attach the certificate of approval when disclosing my financial interests, if applicable.",
      ];

      // Combine all items
      const allItems = [...step1Items, ...step2Items];
      
      // Map to include checked status
      const itemsWithStatus = allItems.map((text, index) => {
        const itemKey = `item${index + 1}`;
        return {
          id: index + 1,
          text,
          checked: applicant.sectionD.checkedItems?.[itemKey] || false
        };
      });

      setDeclarationItems(itemsWithStatus);
    }
  }, [applicant]);

  const handleProceed = () => {
    // Store the applicant document ID in localStorage
    localStorage.setItem('applicantDocId', applicant.id);
    // Navigate to the RecommendationForm
    navigate('/recommendation-form');
    // Close the modal
    onClose();
  };

  if (!applicant) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="applicant-title">
            <h2>{applicant.sectionA?.firstNames} {applicant.sectionA?.surname}</h2>
            <span className={`status-badge ${applicant.status?.toLowerCase() || 'pending'}`}>
              {applicant.status || 'Pending'}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="applicant-summary">
            <div className="summary-item">
              <span className="summary-label">ID Number</span>
              <span className="summary-value">{applicant.sectionA?.identityNumber || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Personnel #</span>
              <span className="summary-value">{applicant.sectionA?.personnelNumber || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Submitted</span>
              <span className="summary-value">{applicant.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}</span>
            </div>
          </div>

          <div className="details-container">
            <div className="section">
              <div className="section-header">
                <h3>Personal Information</h3>
                <div className="section-icon">👤</div>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <span>{applicant.sectionA?.firstNames} {applicant.sectionA?.surname}</span>
                </div>
                <div className="info-item">
                  <label>Email Address</label>
                  <span>{applicant.sectionA?.email}</span>
                </div>
                <div className="info-item">
                  <label>Phone Number</label>
                  <span>{applicant.sectionA?.cellPhone || applicant.sectionA?.officePhone || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-header">
                <h3>Job Details</h3>
                <div className="section-icon">💼</div>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Department</label>
                  <span>{applicant.sectionA?.department}</span>
                </div>
                <div className="info-item">
                  <label>Branch/Cluster</label>
                  <span>{applicant.sectionA?.branch || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Directorate/Unit</label>
                  <span>{applicant.sectionA?.unit || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Job Title</label>
                  <span>{applicant.sectionA?.jobTitle || 'N/A'}</span>
                </div>
              </div>
            </div>

            {applicant.sectionB && (
              <div className="section">
                <div className="section-header">
                  <h3>Working Hours & Remunerative Work</h3>
                  <div className="section-icon">⏱️</div>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Working Hours (per week)</label>
                    <span>{applicant.sectionB?.workingHours || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Standby Hours (per week)</label>
                    <span>{applicant.sectionB?.standbyHours || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Overtime Hours (per month)</label>
                    <span>{applicant.sectionB?.overtimeHours || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Remunerative Work Category</label>
                    <span>{applicant.sectionB?.remunerativeWork || 'N/A'}</span>
                  </div>
                  {applicant.sectionB?.remunerativeWork === "Other" && (
                    <div className="info-item">
                      <label>Other Category</label>
                      <span>{applicant.sectionB?.otherCategory || 'N/A'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {applicant.sectionC && (
              <div className="section">
                <div className="section-header">
                  <h3>Work Details</h3>
                  <div className="section-icon">🏢</div>
                </div>
                <div className="info-grid">
                  {daysOfWeek.length > 0 && (
                    <div className="full-width-item">
                      <label>Weekly Work Schedule</label>
                      <div className="hours-table">
                        <div className="hours-header">
                          <span>Day</span>
                          <span>Hours</span>
                        </div>
                        {daysOfWeek.map((day, index) => (
                          <div key={index} className="hours-row">
                            <span>{day.day}</span>
                            <span>{day.hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="info-item">
                    <label>Total Monthly Hours</label>
                    <span>{applicant.sectionC?.totalMonthlyHours || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Work Address</label>
                    <span>{applicant.sectionC?.workAddress || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Business/Organization</label>
                    <span>{applicant.sectionC?.businessName || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Reporting Person</label>
                    <span>{applicant.sectionC?.reportingPerson || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Estimated Monthly Income</label>
                    <span>{applicant.sectionC?.estimatedIncome ? `R ${applicant.sectionC.estimatedIncome}` : 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {applicant.sectionD && (
              <div className="section">
                <div className="section-header">
                  <h3>Declaration</h3>
                  <div className="section-icon">📝</div>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <span>{applicant.sectionD?.fullName || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Designation</label>
                    <span>{applicant.sectionD?.designation || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Date</label>
                    <span>{applicant.sectionD?.date || 'N/A'}</span>
                  </div>
                  
                  {declarationItems.length > 0 && (
                    <div className="full-width-item">
                      <label>Accepted Terms</label>
                      <div className="declaration-items">
                        {declarationItems
                          .filter(item => item.checked)
                          .map(item => (
                            <div key={item.id} className="declaration-item">
                              <span className="declaration-number">{item.id}.</span>
                              <span className="declaration-text">{item.text}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="action-btn evaluate" onClick={handleProceed}>
            <span className="btn-icon">📋</span>
            Proceed
          </button>
          <button className="action-btn close" onClick={onClose}>
            <span className="btn-icon">✕</span>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantModal;