// MultiStepForm.jsx
import React, { useState } from "react";
import SectionA from "./SectionA";
import SectionB from "./SectionB";
import SectionC from "./SectionC";
import SectionD from "./SectionD";
import Dashboard from "./Dashboard";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export default function MultiStepForm({ department }) {
  const [section, setSection] = useState("A");
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

  const nextSection = () => {
    if (section === "A") setSection("B");
    else if (section === "B") setSection("C");
    else if (section === "C") setSection("D");
  };

  const handleFinalSubmit = async () => {
    try {
      await addDoc(collection(db, "applicants"), formData);
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit. Please try again.");
    }
  };

  return (
    <>
      <Dashboard currentSection={section} />

      {section === "A" && (
        <SectionA formData={formData} handleChange={handleChange} nextSection={nextSection} />
      )}
      {section === "B" && (
        <SectionB formData={formData} handleChange={handleChange} nextSection={nextSection} />
      )}
      {section === "C" && (
        <SectionC formData={formData} handleChange={handleChange} nextSection={nextSection} />
      )}
      {section === "D" && (
        <SectionD formData={formData} handleChange={handleChange} handleFinalSubmit={handleFinalSubmit} />
      )}
    </>
  );
}
