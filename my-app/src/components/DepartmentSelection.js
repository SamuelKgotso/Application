// DepartmentSelection.jsx
import React, { useState } from "react";
import ApplicantForm from "./ApplicantForm";
import "./DepartmentSelection.css";

const departments = [
  "ICT",
  "FINANCE",
  "HRM",
  "SCM",
  "HIS",
  "THERAPUTIC",
  "CLINIC",
  "EXCUTIVE",
  "NURSING",
];

export default function DepartmentSelection() {
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const handleSelect = (dept) => {
    setSelectedDepartment(dept);
  };

  if (selectedDepartment) {
    return <ApplicantForm department={selectedDepartment} />;
  }

  return (
    <div className="department-selection-container">
      <h2>Select Department</h2>
      <div className="department-grid">
        {departments.map((dept) => (
          <div
            key={dept}
            className="department-box"
            onClick={() => handleSelect(dept)}
          >
            {dept}
          </div>
        ))}
      </div>
    </div>
  );
}
