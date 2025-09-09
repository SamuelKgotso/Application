import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate
import "./ApplicantForm.css";

export default function DeclarationForm() {
  const [fullName, setFullName] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const [designation, setDesignation] = useState("");
  const [date, setDate] = useState("");

  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedItems((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Removed alert to prevent popup
    navigate("/recomm-form"); // ✅ Redirect immediately
  };

  return (
    <div className="form-container">
      <h2>SECTION D: DECLARATION BY THE APPLICANT</h2>
      <form className="applicant-form" onSubmit={handleSubmit}>
        <label className="full-width-label">
          I (full name(s) and surname),
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>

        <p style={{ marginTop: "20px" }}>
          <strong>Hereby confirm that:</strong>
        </p>

        <table className="days-table">
          <tbody>
            {[
              "The information supplied in this application form is accurate and truthful;",
              "My performance of other remunerative work will in no way interfere with my commitments to the department, my duties and responsibilities as an employee;",
              "My performance of other remunerative work will not take place during the hours I am required for duty as agreed in my employment contract;",
              "I will not use any state resources for the purpose of performing other remunerative work;",
              "I shall not conduct business with any organ of the state, either in person or as part of an entity (including non-profit organisations);",
              "I will only be involved in the other remunerative work I have applied for; and",
              "This application has been discussed with my supervisor.",
              <ul style={{ paddingLeft: "20px", margin: 0 }}>
                <li>The nature of external work</li>
                <li>Anticipated hours per week/month</li>
                <li>Estimated income</li>
                <li>Address where RWOPS will be performed</li>
              </ul>,
            ].map((text, index) => (
              <tr key={index}>
                <td>{index + 1}.</td>
                <td>{text}</td>
                <td style={{ textAlign: "center", width: "40px" }}>
                  <input
                    type="checkbox"
                    name={`item${index + 1}`}
                    checked={checkedItems[`item${index + 1}`] || false}
                    onChange={handleCheckboxChange}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          <strong>I understand and acknowledge that:</strong>
        </p>

        <table className="days-table">
          <tbody>
            {[
              "My first commitment is to meet the operational objectives of my department and undertake to assist, to the best of my ability, the department in meeting its service delivery demands, including overtime commitments (if applicable) and being on call/standby (when applicable) as scheduled.",
              "Permission to perform other remunerative work is only granted for the work applied for and time agreed upon (and reflected on the certificate of approval);",
              "Should I wish to continue with such other remunerative work, I must submit a new application at least sixty (60) days before expiry of the approved one;",
              "Non-compliance with any of the conditions, monitoring or control measures pertaining to other remunerative work may lead to revocation, disciplinary action, and/or legal proceedings and that the sanction imposed may include forfeiture of other remunerative work approval, remuneration and/or benefits gained;",
              "The normal policies and measures governing discipline also apply in terms of non-compliance with the other remunerative work policy and measures;",
              "The Executive Authority or delegated authority can, at any time, terminate my authorisation to perform other remunerative work, based on a change in operational requirements and/or poor performance on my part.",
              "Abide by any control measures applicable to the other remunerative work system, including that it may be required of me to sign in and out each time I enter or exit the institution where I perform my basic or overtime duties;",
              "Attach the certificate of approval when disclosing my financial interests, if applicable.",
            ].map((text, index) => (
              <tr key={index + 9}>
                <td>{index + 9}.</td>
                <td>{text}</td>
                <td style={{ textAlign: "center", width: "40px" }}>
                  <input
                    type="checkbox"
                    name={`item${index + 9}`}
                    checked={checkedItems[`item${index + 9}`] || false}
                    onChange={handleCheckboxChange}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="signature-section">
          <label>
            Designation:
            <input
              type="text"
              name="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
              placeholder="Signature of Applicant"
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
        </div>

        <button type="submit" className="continue-button">
          Submit Declaration
        </button>
      </form>
    </div>
  );
}
