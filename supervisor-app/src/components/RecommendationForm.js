import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; // Adjust path as needed
import './RecommendationForm.css';

const RecommendationForm = () => {
  const navigate = useNavigate();
  const [applicantDocId, setApplicantDocId] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    supervisorName: '',
    persalNumber: '',
    applicantName: '',
    supervisorRecommendation: '',
    supervisorConditionsText: '',
    supervisorReasonText: '',
    signature: '',
    designation: '',
    signatureDate: '',
    performanceContract: false,
    hoursReviewed: false,
    noConflicts: false,
    concernsAddressed: false
  });

  const [errors, setErrors] = useState({});

  // Get the document ID from localStorage
  useEffect(() => {
    const docId = localStorage.getItem('applicantDocId');
    if (docId) {
      setApplicantDocId(docId);
    } else {
      console.error('No document ID found');
      // Handle error - redirect or show message
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.supervisorName.trim()) {
      newErrors.supervisorName = 'Supervisor name is required';
    }
    if (!formData.persalNumber.trim()) {
      newErrors.persalNumber = 'Persal number is required';
    }
    if (!formData.applicantName.trim()) {
      newErrors.applicantName = 'Applicant name is required';
    }
    if (!formData.supervisorRecommendation) {
      newErrors.supervisorRecommendation = 'Recommendation selection is required';
    } else if (formData.supervisorRecommendation === '5.2' && !formData.supervisorConditionsText.trim()) {
      newErrors.supervisorConditionsText = 'Conditions are required for this recommendation';
    } else if (formData.supervisorRecommendation === '5.3' && !formData.supervisorReasonText.trim()) {
      newErrors.supervisorReasonText = 'Reason is required for non-recommendation';
    }
    if (!formData.signature.trim()) {
      newErrors.signature = 'Signature is required';
    }
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }
    if (!formData.signatureDate) {
      newErrors.signatureDate = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const applicantRef = doc(db, 'applicant', applicantDocId);
      await updateDoc(applicantRef, {
        sectionE: formData,
        updatedAt: new Date()
      });
      
      navigate("/section-form"); // Or next section
    } catch (error) {
      console.error('Error saving section E:', error);
      alert('Error saving form data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationChange = (value) => {
    setFormData(prev => ({
      ...prev,
      supervisorRecommendation: value,
      ...(value !== '5.2' && { supervisorConditionsText: '' }),
      ...(value !== '5.3' && { supervisorReasonText: '' })
    }));
    
    if (errors.supervisorConditionsText || errors.supervisorReasonText) {
      setErrors(prev => ({
        ...prev,
        supervisorConditionsText: '',
        supervisorReasonText: ''
      }));
    }
  };

  return (
    <div className="recommendation-form-container">
      <form className="recommendation-form" onSubmit={handleSubmit} noValidate>
        <div className="form-header">
          <h2>Supervisor Recommendation</h2>
        </div>

        {/* Supervisor Intro */}
        <div className="form-section supervisor-intro">
          <span className="intro-text">I,</span>
          <div className="input-group">
            <input
              type="text"
              name="supervisorName"
              value={formData.supervisorName}
              onChange={handleInputChange}
              placeholder="Supervisor Name"
              className={`inline-input name-input ${errors.supervisorName ? 'error' : ''}`}
            />
            {errors.supervisorName && <span className="error-message">{errors.supervisorName}</span>}
          </div>

          <span className="intro-text">Persal No:</span>
          <div className="input-group">
            <input
              type="text"
              name="persalNumber"
              value={formData.persalNumber}
              onChange={handleInputChange}
              placeholder="Persal Number"
              className={`inline-input ${errors.persalNumber ? 'error' : ''}`}
            />
            {errors.persalNumber && <span className="error-message">{errors.persalNumber}</span>}
          </div>
        </div>

        {/* Applicant Info */}
        <div className="form-section">
          <label>Applicant Name</label>
          <input
            type="text"
            name="applicantName"
            value={formData.applicantName}
            onChange={handleInputChange}
            placeholder="Applicant Name"
            className={`inline-input name-input ${errors.applicantName ? 'error' : ''}`}
          />
          {errors.applicantName && <span className="error-message">{errors.applicantName}</span>}
        </div>

        {/* Checklist */}
        <div className="form-section">
          <ul className="instruction-list">
            <li>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="performanceContract"
                  checked={formData.performanceContract}
                  onChange={handleInputChange}
                />
                Performance contract reviewed
              </label>
            </li>
            <li>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="hoursReviewed"
                  checked={formData.hoursReviewed}
                  onChange={handleInputChange}
                />
                Hours of work reviewed
              </label>
            </li>
            <li>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="noConflicts"
                  checked={formData.noConflicts}
                  onChange={handleInputChange}
                />
                No conflicts of interest
              </label>
            </li>
            <li>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="concernsAddressed"
                  checked={formData.concernsAddressed}
                  onChange={handleInputChange}
                />
                Concerns have been addressed
              </label>
            </li>
          </ul>
        </div>

        {/* Recommendation Section */}
        <div className="form-section">
          <p className="recommendation-prompt">Supervisor’s Recommendation</p>
          <div className="recommendation-options">
            <label className="radio-option">
              <input
                type="radio"
                name="supervisorRecommendation"
                value="5.1"
                checked={formData.supervisorRecommendation === '5.1'}
                onChange={(e) => handleRecommendationChange(e.target.value)}
              />
              Recommended
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="supervisorRecommendation"
                value="5.2"
                checked={formData.supervisorRecommendation === '5.2'}
                onChange={(e) => handleRecommendationChange(e.target.value)}
              />
              Recommended with conditions
            </label>
            {formData.supervisorRecommendation === '5.2' && (
              <textarea
                name="supervisorConditionsText"
                value={formData.supervisorConditionsText}
                onChange={handleInputChange}
                placeholder="Specify conditions..."
                className={`conditions-textarea ${errors.supervisorConditionsText ? 'error' : ''}`}
              />
            )}
            {errors.supervisorConditionsText && <span className="error-message">{errors.supervisorConditionsText}</span>}

            <label className="radio-option">
              <input
                type="radio"
                name="supervisorRecommendation"
                value="5.3"
                checked={formData.supervisorRecommendation === '5.3'}
                onChange={(e) => handleRecommendationChange(e.target.value)}
              />
              Not recommended
            </label>
            {formData.supervisorRecommendation === '5.3' && (
              <textarea
                name="supervisorReasonText"
                value={formData.supervisorReasonText}
                onChange={handleInputChange}
                placeholder="Specify reason..."
                className={`reason-textarea ${errors.supervisorReasonText ? 'error' : ''}`}
              />
            )}
            {errors.supervisorReasonText && <span className="error-message">{errors.supervisorReasonText}</span>}
          </div>
        </div>

        {/* Signature Section */}
        <div className="form-section signature-block">
          <div className="signature-grid">
            <div className="signature-item">
              <label>Signature</label>
              <input
                type="text"
                name="signature"
                value={formData.signature}
                onChange={handleInputChange}
                className={errors.signature ? 'error' : ''}
              />
              {errors.signature && <span className="error-message">{errors.signature}</span>}
            </div>
            <div className="signature-item">
              <label>Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className={errors.designation ? 'error' : ''}
              />
              {errors.designation && <span className="error-message">{errors.designation}</span>}
            </div>
            <div className="signature-item">
              <label>Date</label>
              <input
                type="date"
                name="signatureDate"
                value={formData.signatureDate}
                onChange={handleInputChange}
                className={errors.signatureDate ? 'error' : ''}
              />
              {errors.signatureDate && <span className="error-message">{errors.signatureDate}</span>}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Next Section'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecommendationForm;
