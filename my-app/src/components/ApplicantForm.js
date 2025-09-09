import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import "./ApplicantForm.css";

export default function ApplicantForm({ department }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    surname: "",
    firstNames: "",
    personnelNumber: "",
    identityNumber: "",
    officePhone: "",
    cellPhone: "",
    email: "",
    department: department || "",
    branch: "",
    unit: "",
    jobTitle: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "applicants"), formData); // ✅ Save to Firestore
      alert("Applicant data saved successfully!"); // Optional
      navigate("/detail-form");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to save. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Details of Applicant</h2>
      <form className="applicant-form" onSubmit={handleSubmit}>
        <label>Surname</label>
        <input type="text" name="surname" value={formData.surname} onChange={handleChange} />

        <label>First names</label>
        <input type="text" name="firstNames" value={formData.firstNames} onChange={handleChange} />

        <div className="row">
          <div>
            <label>Personnel / Persal number</label>
            <input type="text" name="personnelNumber" value={formData.personnelNumber} onChange={handleChange} />
          </div>
          <div>
            <label>Identity number</label>
            <input type="text" name="identityNumber" value={formData.identityNumber} onChange={handleChange} />
          </div>
        </div>

        <div className="row">
          <div>
            <label>Office phone number</label>
            <input type="text" name="officePhone" value={formData.officePhone} onChange={handleChange} />
          </div>
          <div>
            <label>Cell-phone number</label>
            <input type="text" name="cellPhone" value={formData.cellPhone} onChange={handleChange} />
          </div>
        </div>

        <label>E-mail address</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />

        <label>Name of the Department</label>
        <input type="text" name="department" value={formData.department} readOnly />

        <label>Branch/Cluster</label>
        <input type="text" name="branch" value={formData.branch} onChange={handleChange} />

        <label>Directorate/Unit</label>
        <input type="text" name="unit" value={formData.unit} onChange={handleChange} />

        <label>Job title and salary level</label>
        <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} />

        <button type="submit" className="continue-button">Continue</button>
      </form>
    </div>
  );
}
