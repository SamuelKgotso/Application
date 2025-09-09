import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { collection, addDoc, serverTimestamp, getDoc, doc, updateDoc } from "firebase/firestore";
import "./FormStyles.css";

export default function SectionA() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    surname: "",
    firstNames: "",
    personnelNumber: "",
    identityNumber: "",
    officePhone: "",
    cellPhone: "",
    email: "",
    department: "",   // ✅ auto-filled from signup
    branch: "",
    unit: "",
    jobTitle: "",
    professionalBody1: "",
    registrationNumber1: "",
    professionalBody2: "",
    registrationNumber2: "",
    professionalBody3: "",
    registrationNumber3: "",
    jobFunctions: "",
    designatedEmployee: "",
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [readyToSubmit, setReadyToSubmit] = useState(false);

  // ✅ Fetch authenticated user & auto-load email + department
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);

        try {
          // 🔹 Load signup info from applicant collection
          const userDoc = await getDoc(doc(db, "applicant", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFormData((prev) => {
              const updated = {
                ...prev,
                email: userData.email || user.email,
                department: userData.department || "", // ✅ auto-filled
              };
              localStorage.setItem("sectionAData", JSON.stringify(updated));
              return updated;
            });
          }
        } catch (error) {
          console.error("❌ Error fetching applicant data:", error);
        }
      } else {
        navigate("/login");
      }
    });

    return unsubscribe;
  }, [navigate]);

  // Load form data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sectionAData");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  // Save form data to localStorage
  const saveToLocalStorage = (data) => {
    localStorage.setItem("sectionAData", JSON.stringify(data));
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      saveToLocalStorage(updated);
      return updated;
    });
  };

  // Step validation
  const canProceedToNext = () => {
    if (currentStep === 1) {
      return formData.surname.trim() !== "" && formData.firstNames.trim() !== "";
    }
    if (currentStep === 3) {
      return formData.email.trim() !== "" && formData.department.trim() !== "";
    }
    return true;
  };

  // Step navigation
  const nextStep = () => {
    if (canProceedToNext()) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    } else {
      alert("Please fill all required fields in this step before continuing.");
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Submit to Firestore
  const handleSubmit = async () => {
    if (!currentUser) {
      alert("You must be logged in to submit this form");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      // Create a new document in applicantForms collection
      const docRef = await addDoc(collection(db, "applicant"), {
        sectionA: formData, // Store as sectionA
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      localStorage.setItem("applicantDocId", docRef.id);
      localStorage.removeItem("sectionAData");

      console.log("✅ Section A saved with ID:", docRef.id);
      navigate("/appform/section-b");
    } catch (error) {
      console.error("❌ Error saving Section A:", error);
      alert("Failed to save form data. Please try again.");
    } finally {
      setLoading(false);
      setReadyToSubmit(false);
    }
  };

  const confirmSubmit = () => {
    if (window.confirm("Are you sure you want to submit Section A?")) {
      setReadyToSubmit(true);
    }
  };

  useEffect(() => {
    if (readyToSubmit) {
      handleSubmit();
    }
  }, [readyToSubmit]);

  return (
    <div className="form-container">
      <h2>Section A: Applicant & Job Details</h2>
      {currentUser && (
        <div className="user-info">
          <p>Submitting as: <strong>{currentUser.email}</strong></p>
        </div>
      )}
      
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Step 1 */}
        {currentStep === 1 && (
          <>
            <label>Surname</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
            />

            <label>First names</label>
            <input
              type="text"
              name="firstNames"
              value={formData.firstNames}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <>
            <label>Personnel / Persal number</label>
            <input
              type="text"
              name="personnelNumber"
              value={formData.personnelNumber}
              onChange={handleChange}
            />

            <label>Identity number</label>
            <input
              type="text"
              name="identityNumber"
              value={formData.identityNumber}
              onChange={handleChange}
            />

            <label>Office phone number</label>
            <input
              type="text"
              name="officePhone"
              value={formData.officePhone}
              onChange={handleChange}
            />

            <label>Cell-phone number</label>
            <input
              type="text"
              name="cellPhone"
              value={formData.cellPhone}
              onChange={handleChange}
            />
          </>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <>
            <label>E-mail address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled   // ✅ locked
            />

            <label>Department (from Signup)</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              disabled   // ✅ locked
            />
            
            <label>Branch/Cluster</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
            />

            <label>Directorate/Unit</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            />

            <label>Job title and salary level</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
            />
          </>
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <>
            <label>Name of professional body 1</label>
            <input
              type="text"
              name="professionalBody1"
              value={formData.professionalBody1}
              onChange={handleChange}
            />

            <label>Registration number at professional body 1</label>
            <input
              type="text"
              name="registrationNumber1"
              value={formData.registrationNumber1}
              onChange={handleChange}
            />

            <label>Name of professional body 2</label>
            <input
              type="text"
              name="professionalBody2"
              value={formData.professionalBody2}
              onChange={handleChange}
            />

            <label>Registration number at professional body 2</label>
            <input
              type="text"
              name="registrationNumber2"
              value={formData.registrationNumber2}
              onChange={handleChange}
            />
          </>
        )}

        {/* Step 5 */}
        {currentStep === 5 && (
          <>
            <label>Name of professional body 3</label>
            <input
              type="text"
              name="professionalBody3"
              value={formData.professionalBody3}
              onChange={handleChange}
            />

            <label>Registration number at professional body 3</label>
            <input
              type="text"
              name="registrationNumber3"
              value={formData.registrationNumber3}
              onChange={handleChange}
            />

            <label>Job functions (Key performance areas)</label>
            <textarea
              name="jobFunctions"
              value={formData.jobFunctions}
              onChange={handleChange}
              rows="5"
            ></textarea>

            <label>Are you a designated employee?</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="designatedEmployee"
                  value="yes"
                  checked={formData.designatedEmployee === "yes"}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="designatedEmployee"
                  value="no"
                  checked={formData.designatedEmployee === "no"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="button-row">
          {currentStep > 1 && (
            <button type="button" className="back-btn" onClick={prevStep}>
              Back
            </button>
          )}
          {currentStep < 5 ? (
            <button type="button" className="continue-button" onClick={nextStep}>
              Next
            </button>
          ) : (
            <button
              type="button"
              className="continue-button"
              onClick={confirmSubmit}
              disabled={loading || !currentUser}
            >
              {loading ? "Submitting..." : "Submit Section"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}