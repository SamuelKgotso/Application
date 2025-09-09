import React from "react";
import { useNavigate } from "react-router-dom"; // ← Add this
import "./ApplicantForm.css";

export default function RemunerativeDetailsForm() {
  const navigate = useNavigate(); // ← Initialize navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    // You could add validation or state handling here
    navigate("/declare-form"); // ← Redirect to DeclarationForm
  };

  return (
    <div className="form-container">
      <h2>Section C: Other Remunerative Work Details</h2>
      <form className="applicant-form" onSubmit={handleSubmit}>
        <h4>3.3. Specify the days of the week and specific hours that work will be performed</h4>
        <table className="days-table">
          <thead>
            <tr>
              <th>Day of the week</th>
              <th>Hours involved</th>
            </tr>
          </thead>
          <tbody>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <tr key={day}>
                <td>{day}</td>
                <td>
                  <input
                    type="text"
                    name={`hours_${day.toLowerCase()}`}
                   
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <label className="full-width-label">
          3.4 Total number of hours planned for performing the other remunerative work (per month)
          <input type="number" name="totalMonthlyHours" />
        </label>

        <label className="full-width-label">
          3.5 Specify physical address where the other remunerative work will be performed
          <input type="text" name="workAddress" />
        </label>

        <h4>3.6 If the work will be undertaken within an established organisation:</h4>
        <label className="full-width-label">
          3.6.1 Name of business/organisation
          <input type="text" name="businessName" />
        </label>

        <label className="full-width-label">
          3.6.2 Details of person you will be reporting to
          <input type="text" name="reportingPerson" />
        </label>

        <label className="full-width-label">
          3.7 Specify estimated income per month
          <input type="number" name="estimatedIncome" />
        </label>

        <button type="submit" className="continue-button">Submit</button>
      </form>
    </div>
  );
}
