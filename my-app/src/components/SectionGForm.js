import React, { useState } from 'react';
import './ApplicantForm.css';

const SectionGForm = () => {
  const [approvalStatus, setApprovalStatus] = useState('');
  const [comments, setComments] = useState('');
  const [nameSurname, setNameSurname] = useState('');
  const [designation, setDesignation] = useState('');
  const [signature, setSignature] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!approvalStatus) {
      alert('Please select approval status.');
      return;
    }

    if (approvalStatus === 'notApproved' && comments.trim() === '') {
      alert('Please provide comments/reasons for not granting permission.');
      return;
    }

    if (!nameSurname.trim() || !designation.trim() || !signature.trim() || !date.trim()) {
      alert('Please complete all signature fields.');
      return;
    }

    alert('Section G form submitted successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="form-container applicant-form">
      <h2>SECTION G: APPROVAL BY THE HEAD OF DEPARTMENT</h2>

      <label>1. The application is:</label>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="approvalStatus"
            value="approved"
            checked={approvalStatus === 'approved'}
            onChange={(e) => setApprovalStatus(e.target.value)}
          />
          Approved
        </label>
        <label>
          <input
            type="radio"
            name="approvalStatus"
            value="notApproved"
            checked={approvalStatus === 'notApproved'}
            onChange={(e) => setApprovalStatus(e.target.value)}
          />
          Not approved
        </label>
      </div>

      {approvalStatus === 'notApproved' && (
        <div>
          <label className="full-width-label">
            2. Comments/reasons for not granting permission:
            <textarea
              className="samuel"
              rows={5}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Write comments or reasons here..."
            />
          </label>
        </div>
      )}

      <div className="signature-section">
        <label>
          Name and surname
          <input
            type="text"
            value={nameSurname}
            onChange={(e) => setNameSurname(e.target.value)}
            placeholder="Enter full name"
          />
        </label>

        <label>
          Signature of Head of Department
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Signature"
          />
        </label>
      </div>

      <div className="signature-section">
        <label>
          Designation
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="Enter designation"
          />
        </label>

        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </div>

      <button type="submit" className="continue-button">
        Submit Approval
      </button>
    </form>
  );
};

export default SectionGForm;
