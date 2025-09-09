import React, { useState } from 'react';
import './RecommendationForm.css';

const EthicsForm = () => {
  const [riskRecommendation, setRiskRecommendation] = useState('');
  const [riskReasonText, setRiskReasonText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", {
      recommendation: riskRecommendation,
      reason: riskReasonText,
    });
    alert("Recommendation submitted successfully!");
  };

  return (
    <div className="recommendation-form-container">
      <div className="form-header">
        <h2>SECTION F: RECOMMENDATION BY THE CHIEF RISK OFFICER</h2>
      </div>

      <form className="recommendation-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <p className="recommendation-prompt">
            Based on the analysis conducted using the Ethics Officer Analysis Tool 
            for Other Remunerative Work Application, I recommend the following:
          </p>

          {/* Radio Options */}
          <div className="recommendation-options">
            <label className="radio-option">
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
            <label className="radio-option">
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

          {/* Success Message */}
          {riskRecommendation === 'recommended' && (
            <div className="info-box">
              <p>
                The proposed ORW application meets all the ethics and integrity 
                requirements, and there are no identified conflicts of interest 
                or unethical conduct.
              </p>
            </div>
          )}

          {/* Error Message */}
          {riskRecommendation === 'notRecommended' && (
            <div>
              <div className="info-box">
                <p>
                  The proposed ORW application is <strong>not recommended</strong> 
                  due to conflicts of interest or unethical conduct.
                </p>
              </div>

              <textarea
                className="reason-textarea"
                rows="4"
                placeholder="Provide detailed reasons..."
                value={riskReasonText}
                onChange={(e) => setRiskReasonText(e.target.value)}
              />

              {/* Checkboxes */}
              <div className="checkbox-grid">
                <label className="checkbox-option">
                  <input type="checkbox" /> Conflict of interest
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" /> Conducting Business with the State
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" /> Unethical conduct
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Signature Section */}
        <div className="form-section signature-block">
          <div className="signature-grid">
            <div className="signature-item">
              <label>Name and Surname</label>
              <input type="text" placeholder="Enter full name" />
            </div>
            <div className="signature-item">
              <label>Signature of Supervisor</label>
              <input type="text" placeholder="Signature" />
            </div>
          </div>

          <div className="signature-grid">
            <div className="signature-item">
              <label>Designation</label>
              <input type="text" placeholder="Enter designation" />
            </div>
            <div className="signature-item">
              <label>Date</label>
              <input type="date" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button className="btn-primary" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EthicsForm;
