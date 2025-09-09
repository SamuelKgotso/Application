import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="form-container">
      <h2>About This Application Form</h2>
      <p>
        This form is issued by the <strong>Republic of South Africa</strong> and is governed by
        Section 30 of the <strong>Public Service Act, 1994</strong>. It is intended for use by any
        permanent or temporary employee of a:
      </p>
      <ul>
        <li>National Department</li>
        <li>Government Component</li>
        <li>Provincial Department</li>
      </ul>
      <p>
        The purpose of this application is to obtain official <strong>permission to perform other
        remunerative work</strong> outside of one's normal employment in the department.
      </p>

      <h3>Structure of the Form</h3>
      <p>The form is divided into several sections based on the role of the person completing it:</p>

      <h4>📌 To be completed by the Applicant</h4>
      <ul>
        <li><strong>Section A:</strong> Personal Details of Applicant</li>
        <li><strong>Section B:</strong> Working Hours</li>
        <li><strong>Section C:</strong> Application for Other Remunerative Work</li>
        <li><strong>Section D:</strong> Declaration</li>
      </ul>

      <h4>🧑‍💼 To be completed by the Immediate Supervisor</h4>
      <ul>
        <li><strong>Section E:</strong> Recommendations</li>
      </ul>

      <h4>🕵️ To be completed by the Ethics Officer</h4>
      <ul>
        <li><strong>Section F:</strong> Recommendations</li>
      </ul>

      <h4>✅ To be completed by the Executive Authority or Delegated Authority</h4>
      <ul>
        <li><strong>Section G:</strong> Approval</li>
        <li><strong>Certificate:</strong> Approval of Other Remunerative Work</li>
      </ul>

      <p>
        A final <strong>Letter to Confirm Deemed Approval</strong> must be signed by the Ethics
        Officer once the process is completed.
      </p>
    </div>
  );
}
