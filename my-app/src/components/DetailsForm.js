import React from "react";
import { useNavigate } from "react-router-dom";
import "./ApplicantForm.css";

export default function DetailsForm() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/work-form");
  };

  return (
    <div className="form-container">
      <h2>Professional and Job Details</h2>
      <form className="applicant-form" onSubmit={handleSubmit}>
        <label>Name of professional body 1</label>
        <input type="text" name="professionalBody1" />

        <label>Registration number at professional body 1</label>
        <input type="text" name="registrationNumber1" />

        <label>Name of professional body 2</label>
        <input type="text" name="professionalBody2" />

        <label>Registration number at professional body 2</label>
        <input type="text" name="registrationNumber2" />

        <label>Name of professional body 3</label>
        <input type="text" name="professionalBody3" />

        <label>Registration number at professional body 3</label>
        <input type="text" name="registrationNumber3" />

        <label>Job functions (Key performance areas)</label>
        <textarea name="jobFunctions" rows="5"></textarea>

        <label>Are you a designated employee?</label>
        <div className="radio-group">
          <label><input type="radio" name="designatedEmployee" value="yes" /> Yes</label>
          <label><input type="radio" name="designatedEmployee" value="no" /> No</label>
        </div>

        <button type="submit" className="continue-button">Continue</button>
      </form>
    </div>
  );
}
