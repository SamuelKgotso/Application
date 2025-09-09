// src/components/ApplicantDash.jsx
import React from "react";
import SectionA from "./SectionA";
import SectionB from "./SectionB";
import SectionC from "./SectionC";
import SectionD from "./SectionD";
import "./Dashboard.css";

export default function ApplicantDash({ currentSection }) {
  const steps = [
    { label: "Section A", id: "A" },
    { label: "Section B", id: "B" },
    { label: "Section C", id: "C" },
    { label: "Section D", id: "D" },
  ];

  const renderSectionForm = () => {
    switch (currentSection) {
      case "A":
        return <SectionA />;
      case "B":
        return <SectionB />;
      case "C":
        return <SectionC />;
      case "D":
        return <SectionD />;
      default:
        return <p>No application started yet.</p>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <ul>
          <li>Apply / Continue Application</li>
          <li>Status</li>
          <li>Download</li>
          <li>Certificate / Letter</li>
          <li>Re-apply</li>
        </ul>
      </aside>

      <main className="main-content">
        <h1>Welcome, Applicant</h1>
        <h3>
          Department: <span className="department-name">Assigned Department Name</span>
        </h3>
        <p className="status-label">
          <strong>Status:</strong>{" "}
          {currentSection ? (
            <>Currently at <strong>Section {currentSection}</strong></>
          ) : (
            <>No application has been started.</>
          )}
        </p>

        <br />

        <div className="progress-box center-box">
          <div className="tracker">
            {steps.map((step) => (
              <div className="step" key={step.id}>
                <span
                  className={`step-circle ${
                    currentSection === step.id ? "active" : ""
                  }`}
                />
                <span className="step-label">{step.label}</span>
              </div>
            ))}
          </div>

          {renderSectionForm()}
        </div>
      </main>
    </div>
  );
}
