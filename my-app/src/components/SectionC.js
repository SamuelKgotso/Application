import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import "./FormStyles.css";

export default function SectionC() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
    totalMonthlyHours: "",
    workAddress: "",
    businessName: "",
    reportingPerson: "",
    estimatedIncome: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get current authenticated user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        navigate("/login");
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const applicantId = localStorage.getItem("applicantDocId");
      if (!applicantId) {
        alert("⚠️ No applicant record found. Please complete Section A first.");
        return;
      }

      // Update the same document in applicantForms collection
      const docRef = doc(db, "applicant", applicantId);
      await updateDoc(docRef, {
        sectionC: formData, // Store as sectionC
        updatedAt: serverTimestamp(),
      });

      console.log("✅ Section C updated for ID:", applicantId);
      navigate("/appform/section-d");
    } catch (error) {
      console.error("❌ Error saving Section C:", error);
      alert("Failed to save Section C. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Section C: Other Remunerative Work Details</h2>

      {currentUser && (
        <div className="user-info">
          <p>
            Submitting as: <strong>{currentUser.email}</strong>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <>
            <h4>3.3. Specify the days of the week and specific hours that work will be performed</h4>
            <table className="days-table">
              <thead>
                <tr>
                  <th>Day of the week</th>
                  <th>Hours involved</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ].map((day) => (
                  <tr key={day}>
                    <td>{day.charAt(0).toUpperCase() + day.slice(1)}</td>
                    <td>
                      <input
                        type="text"
                        name={day}
                        value={formData[day]}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {currentStep === 2 && (
          <>
            <label className="full-width-label">
              3.4 Total number of hours planned (per month)
              <input
                type="number"
                name="totalMonthlyHours"
                value={formData.totalMonthlyHours}
                onChange={handleChange}
              />
            </label>

            <label className="full-width-label">
              3.5 Physical address where the work will be performed
              <input
                type="text"
                name="workAddress"
                value={formData.workAddress}
                onChange={handleChange}
              />
            </label>

            <h4>3.6 If the work will be undertaken within an established organisation:</h4>
            <label className="full-width-label">
              3.6.1 Name of business/organisation
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
              />
            </label>

            <label className="full-width-label">
              3.6.2 Details of person you will be reporting to
              <input
                type="text"
                name="reportingPerson"
                value={formData.reportingPerson}
                onChange={handleChange}
              />
            </label>
          </>
        )}

        {currentStep === 3 && (
          <label className="full-width-label">
            3.7 Estimated income per month
            <input
              type="number"
              name="estimatedIncome"
              value={formData.estimatedIncome}
              onChange={handleChange}
            />
          </label>
        )}

        <div className="button-row">
          {currentStep > 1 && (
            <button type="button" className="back-btn" onClick={prevStep}>
              Back
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              className="continue-button"
              onClick={nextStep}
            >
              Next
            </button>
          ) : (
            <button type="submit" className="continue-button" disabled={loading}>
              {loading ? "Saving..." : "Submit Section C"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}