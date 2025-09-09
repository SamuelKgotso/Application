import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import added
import "./ApplicantForm.css";

export default function DetailsForm() {
  const navigate = useNavigate();
  const [otherCategory, setOtherCategory] = useState(""); // ✅ useState added
  const [selectedWork, setSelectedWork] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Optionally validate before navigation
    navigate("/remune-form");
  };

  const handleRadioChange = (e) => {
    setSelectedWork(e.target.value);
    if (e.target.value !== "Other") {
      setOtherCategory(""); // Clear otherCategory if not selected
    }
  };

  return (
    <div className="form-container">
      <h2>Section B & C: Working Hours & Remunerative Work</h2>
      <form className="applicant-form" onSubmit={handleSubmit}>
        {/* SECTION B: WORKING HOURS */}
        <h3>SECTION B: WORKING HOURS</h3>
        <table className="hours-table">
          <thead>
            <tr>
              <th style={{ width: "75%" }}></th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1. Current working hours of the applicant (per week)</td>
              <td><input type="number" name="workingHours" /></td>
            </tr>
            <tr>
              <td>2. Call/standby duties hours (per week)</td>
              <td><input type="number" name="standbyHours" /></td>
            </tr>
            <tr>
              <td>3. Current Commuted Overtime /overtime hours worked (per month)</td>
              <td><input type="number" name="overtimeHours" /></td>
            </tr>
          </tbody>
        </table>

        {/* SECTION C: REMUNERATIVE WORK */}
        <h3>SECTION C: APPLICATION FOR OTHER REMUNERATIVE WORK</h3>
        <p>Please select the category of other remunerative work applying for.</p>
        <p><strong>Tick only one option</strong></p>

        <div className="checkbox-grid">
          {/* Radio group – mapped for cleaner code optional */}
          {[
            "Architecture Planning and Surveying",
            "Building Construction",
            "Consultancy Work",
            "Design (Textiles, Graphics)",
            "Engineering and Mechanical Repairs",
            "Farming and Breeding",
            "Fashion Design/Sewing",
            "Financial Markets",
            "Fitness Industry",
            "Medical Doctors",
            "Nursing and Midwifery Professionals",
            "Traditional and Complementary Professionals",
            "Paramedical Practitioners",
            "Sport Scientists",
            "Veterinarians",
            "Other Health Professionals",
            "Hospitality Industry",
            "Import and Export Business",
            "Information and Communication",
            "Logistics and Transport",
            "Manufacturing/Mining Construction",
            "Retail and Wholesale Trade",
            "Sales and Marketing",
            "Security Industry",
            "Sports Recreation and Cultural",
            "Training Research and Development",
            "Tavern Owner and Restaurants",
            "Pastoral Services",
            "Funeral Parlor",
            "Other"
          ].map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="remunerativeWork"
                value={option}
                checked={selectedWork === option}
                onChange={handleRadioChange}
              />
              {option === "Other"
                ? "Other (Please specify):"
                : option}
            </label>
          ))}

          {selectedWork === "Other" && (
            <input
              type="text"
              name="otherCategory"
              placeholder="Specify other category"
              value={otherCategory}
              onChange={(e) => setOtherCategory(e.target.value)}
            />
          )}
        </div>

        {/* Description of work */}
        <div className="text-block">
          <label>
            2. Describe in detail the nature of the other remunerative work that will be performed (i.e. company activities and your role)
          </label>
          <textarea name="remunerativeWorkDescription" rows="5"></textarea>
        </div>

        {/* Dates */}
        <div className="date-section">
          <label>
            3.1 Planned start date of other remunerative work <br />
            <small>(Note: Permission is only granted for a maximum of 12 months)</small>
          </label>
          <input type="date" name="startDate" />

          <label>3.2 Planned end date of the other remunerative work</label>
          <input type="date" name="endDate" />
        </div>

        {/* Submit */}
        <button type="submit" className="continue-button">Submit</button>
      </form>
    </div>
  );
}
