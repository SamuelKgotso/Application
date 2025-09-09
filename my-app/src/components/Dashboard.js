// Dashboard.jsx
import React from "react";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <ul>
         
          <li>Apply/Continue Application</li>
          <li>Status</li>
          <li>Download</li>
          <li>Certificate/Letter</li>
          <li>Re-apply</li>
          
        </ul>
      </aside>

      <main className="main-content">
        <h1>Welcome, Applicant</h1>
        <h3>Department: <span className="department-name">Assigned Department Name</span></h3>
        <p className="status-label"><strong>Status:</strong> Current application status</p>
        < br/>
        <div className="progress-box center-box">
          <div className="tracker">
            <div className="step">
              <span className="step-circle" />
              <span className="step-label">Draft</span>
            </div>
            <div className="step">
              <span className="step-circle" />
              <span className="step-label">Supervisor Review</span>
            </div>
            <div className="step">
              <span className="step-circle" />
              <span className="step-label">Ethics Review</span>
            </div>
            <div className="step">
              <span className="step-circle" />
              <span className="step-label">HOD Review</span>
            </div>
            
            <div className="step">
              <span className="step-circle" />
              <span className="step-label">Finalize</span>
            </div>
          </div>
          <p className="no-app-msg">No application has been created</p>
           < br/>
          <button className="start-btn">Tracking Application</button>
        </div>
      </main>
    </div>
  );
}