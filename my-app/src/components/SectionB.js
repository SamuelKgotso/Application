import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import "./FormStyles.css";

export default function SectionB() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    workingHours: "",
    standbyHours: "",
    overtimeHours: "",
    remunerativeWork: "",
    otherCategory: "",
    remunerativeWorkDescription: "",
    startDate: "",
    endDate: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
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

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "remunerativeWork" && value !== "Other"
        ? { otherCategory: "" }
        : {}),
    }));
  };

  // Step navigation
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Submit Section B
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to submit this form");
      navigate("/login");
      return;
    }

    const applicantId = localStorage.getItem("applicantDocId");
    if (!applicantId) {
      alert("No applicant record found. Please complete Section A first.");
      return;
    }

    setLoading(true);
    try {
      // Update the same document in applicantForms collection
      const docRef = doc(db, "applicant", applicantId);

      await updateDoc(docRef, {
        sectionB: formData, // Store as sectionB
        updatedAt: serverTimestamp(),
      });

      console.log("✅ Section B saved under applicant ID:", applicantId);
      navigate("/appform/section-c");
    } catch (error) {
      console.error("❌ Error saving Section B:", error);
      alert("Failed to save Section B. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
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
    "Other",
  ];

  return (
    <div className="form-container">
      <h2>Section B: Working Hours & Remunerative Work</h2>

      {currentUser && (
        <div className="user-info">
          <p>
            Submitting as: <strong>{currentUser.email}</strong>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1 */}
        {currentStep === 1 && (
          <>
            <h3>SECTION B: WORKING HOURS</h3>
            <div className="row">
              <label>1. Current working hours (per week)</label>
              <input
                type="number"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <label>2. Call/standby duties hours (per week)</label>
              <input
                type="number"
                name="standbyHours"
                value={formData.standbyHours}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <label>3. Overtime hours worked (per month)</label>
              <input
                type="number"
                name="overtimeHours"
                value={formData.overtimeHours}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <>
            <h3>SECTION C: CATEGORY OF OTHER REMUNERATIVE WORK</h3>
            <p>Please select one option</p>

            <div className="categories-grid">
              {categories.map((option) => (
                <label
                  key={option}
                  className={`category-item ${
                    option === "Other" ? "full-width" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="remunerativeWork"
                    value={option}
                    checked={formData.remunerativeWork === option}
                    onChange={handleChange}
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
            <br />
            {formData.remunerativeWork === "Other" && (
              <input
                type="text"
                name="otherCategory"
                placeholder="Specify other category"
                value={formData.otherCategory}
                onChange={handleChange}
                className="other-input"
                required
              />
            )}
          </>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <>
            <div className="form-group">
              <label htmlFor="remunerativeWorkDescription">
                Describe in detail the nature of the other remunerative work
              </label>
              <textarea
                id="remunerativeWorkDescription"
                name="remunerativeWorkDescription"
                value={formData.remunerativeWorkDescription}
                onChange={handleChange}
                rows="5"
                placeholder="Enter detailed description here..."
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="startDate">
                Planned start date <br />
                <small>(Max 12 months permission)</small>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">Planned end date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="button-row">
          {currentStep > 1 && (
            <button type="button" className="back-btn" onClick={prevStep}>
              Back
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              className="continue-button"
              onClick={nextStep}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="continue-button"
              disabled={loading || !currentUser}
            >
              {loading ? "Saving..." : "Submit Section B"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}