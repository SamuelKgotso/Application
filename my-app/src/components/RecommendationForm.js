import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigation
import './RecommendationForm.css';

const RecommendationForm = () => {
  const navigate = useNavigate(); // Initialize navigation hook

  const [supervisorRecommendation, setSupervisorRecommendation] = useState('');
  const [supervisorConditionsText, setSupervisorConditionsText] = useState('');
  const [supervisorReasonText, setSupervisorReasonText] = useState('');

  const [riskRecommendation, setRiskRecommendation] = useState('');
  const [riskReasonText, setRiskReasonText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic
    if (!supervisorRecommendation) {
      alert('Please select a supervisor recommendation.');
      return;
    }

    if (supervisorRecommendation === '5.2' && supervisorConditionsText.trim() === '') {
      alert('Please provide conditions for the supervisor recommendation.');
      return;
    }

    if (supervisorRecommendation === '5.3' && supervisorReasonText.trim() === '') {
      alert('Please provide a reason for the supervisor non-recommendation.');
      return;
    }

    if (!riskRecommendation) {
      alert('Please select a Chief Risk Officer recommendation.');
      return;
    }

    if (riskRecommendation === 'notRecommended' && riskReasonText.trim() === '') {
      alert('Please provide a reason for the Chief Risk Officer non-recommendation.');
      return;
    }

    // Navigate to SectionGForm after successful submission
    navigate("/section-form");
  };

  return (
    <div className="form-container">
      <h2>SECTION E: RECOMMENDATION BY IMMEDIATE SUPERVISOR</h2>
      <form className="applicant-form" onSubmit={handleSubmit}>
        <label className="full-width-label">
          I .................................................................................................................................................................. (name and surname of the supervisor),
        </label>

        <label className="full-width-label">
          Persal number: .................................................................................................... <strong>confirms that:</strong>
        </label>

        <p>1. I am the immediate supervisor of ............................................................................................ (name and surname of the applicant); and the applicant discussed his/her application for other remunerative work with me.</p>

        <p>2. I certify that the proposed RWOPS activities will not interfere with the employee's ability to fulfill their official responsibilities.</p>

        <p>3. I commit to monitoring the employee’s adherence to RWOPS conditions and will report any instances of non-compliance.</p>

        <p>4. I confirm that</p>

        <div className="checkbox-grid">
          <label><input type="checkbox" /> The employee has signed a Performance Contract and the employee’s performance reviews will be conducted</label>
          <label><input type="checkbox" /> RWOPS hours have been reviewed and are in compliance with regulations.</label>
          <label><input type="checkbox" /> No conflicts between RWOPS activities and official duties have been identified.</label>
          <label><input type="checkbox" /> Any concerns regarding RWOPS compliance have been documented and addressed.</label>
        </div>

        <p><strong>5.</strong> Based on the analysis conducted using the Supervisor Analysis Tool for Other Remunerative Work Application, I recommend the following:</p>

        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="supervisorRecommendation"
              value="5.1"
              checked={supervisorRecommendation === '5.1'}
              onChange={(e) => {
                setSupervisorRecommendation(e.target.value);
                setSupervisorConditionsText('');
                setSupervisorReasonText('');
              }}
            />
            <strong>5.1 Recommendation</strong>
          </label>
        </div>

        {supervisorRecommendation === '5.1' && (
          <div className="text-block">
            <p>The proposed other remunerative work is not expected to interfere with the primary job responsibilities of the applicant or organizational goals.</p>
            <p><strong>Additional Notes:</strong> The applicant has demonstrated the capability to manage both roles effectively.</p>
          </div>
        )}

        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="supervisorRecommendation"
              value="5.2"
              checked={supervisorRecommendation === '5.2'}
              onChange={(e) => {
                setSupervisorRecommendation(e.target.value);
                setSupervisorReasonText('');
              }}
            />
            <strong>5.2 Recommendation with Conditions</strong>
          </label>
        </div>

        {supervisorRecommendation === '5.2' && (
          <div className="text-block">
            <p>The proposed other remunerative work is recommended with the following conditions:</p>
            <textarea
              rows="5"
              placeholder="Write conditions here..."
              value={supervisorConditionsText}
              onChange={(e) => setSupervisorConditionsText(e.target.value)}
            />
          </div>
        )}

        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="supervisorRecommendation"
              value="5.3"
              checked={supervisorRecommendation === '5.3'}
              onChange={(e) => {
                setSupervisorRecommendation(e.target.value);
                setSupervisorConditionsText('');
              }}
            />
            <strong>5.3 Not Recommended</strong>
          </label>
        </div>

        {supervisorRecommendation === '5.3' && (
          <div className="text-block">
            <p>The proposed other remunerative work is likely to interfere with the employee’s responsibilities.</p>
            <textarea
              rows="4"
              placeholder="Write reasons here..."
              value={supervisorReasonText}
              onChange={(e) => setSupervisorReasonText(e.target.value)}
            />
          </div>
        )}

        <h2>SECTION F: RECOMMENDATION BY THE CHIEF RISK OFFICER</h2>

        <p>Based on the analysis conducted using the Ethics Officer Analysis Tool for Other Remunerative Work Application, I recommend the following:</p>

        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="riskRecommendation"
              value="recommended"
              checked={riskRecommendation === 'recommended'}
              onChange={() => {
                setRiskRecommendation('recommended');
                setRiskReasonText('');
              }}
            />
            <strong>Recommended</strong>
          </label>
          <label>
            <input
              type="radio"
              name="riskRecommendation"
              value="notRecommended"
              checked={riskRecommendation === 'notRecommended'}
              onChange={() => setRiskRecommendation('notRecommended')}
            />
            <strong>Not Recommended</strong>
          </label>
        </div>

        {riskRecommendation === 'recommended' && (
          <div className="text-block">
            <p>The proposed ORW application meets all the ethics and integrity requirements, and there are no identified conflicts of interest or unethical conduct.</p>
          </div>
        )}

        {riskRecommendation === 'notRecommended' && (
          <div className="text-block">
            <p>The proposed ORW application is <strong>not recommended</strong> due to conflicts of interest or unethical conduct.</p>
            <textarea
              className="samuel"
              rows="4"
              placeholder="Provide detailed reasons..."
              value={riskReasonText}
              onChange={(e) => setRiskReasonText(e.target.value)}
            />
            <div className="checkbox-grid">
              <label><input type="checkbox" /> Conflict of interest</label>
              <label><input type="checkbox" /> Conducting Business with the State</label>
              <label><input type="checkbox" /> Unethical conduct</label>
            </div>
          </div>
        )}

        <div className="signature-section">
          <label>
            Name and Surname
            <input type="text" placeholder="Enter full name" />
          </label>
          <label>
            Signature of Supervisor
            <input type="text" placeholder="Signature" />
          </label>
        </div>

        <div className="signature-section">
          <label>
            Designation
            <input type="text" placeholder="Enter designation" />
          </label>
          <label>
            Date
            <input type="date" />
          </label>
        </div>

        <button className="continue-button" type="submit">
          Submit Recommendation
        </button>
      </form>
    </div>
  );
};

export default RecommendationForm;
