import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";
import "./SupervisorPanel.css";

const SupervisorPanel = () => {
  const navigate = useNavigate();

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

  // Define Section D items for display
  const sectionDItems = {
    item1: "The information supplied in this application form is accurate and truthful;",
    item2: "My performance of other remunerative work will in no way interfere with my commitments to the department, my duties and responsibilities as an employee;",
    item3: "My performance of other remunerative work will not take place during the hours I am required for duty as agreed in my employment contract;",
    item4: "I will not use any state resources for the purpose of performing other remunerative work;",
    item5: "I shall not conduct business with any organ of the state, either in person or as part of an entity (including non-profit organisations);",
    item6: "I will only be involved in the other remunerative work I have applied for; and",
    item7: "This application has been discussed with my supervisor.",
    item8: "External work details: The nature of external work, hours per week/month, estimated income, and work address",
    item9: "My first commitment is to meet the operational objectives of my department and undertake to assist, to the best of my ability, the department in meeting its service delivery demands, including overtime commitments (if applicable) and being on call/standby (when applicable) as scheduled.",
    item10: "Permission to perform other remunerative work is only granted for the work applied for and time agreed upon (and reflected on the certificate of approval);",
    item11: "Should I wish to continue with such other remunerative work, I must submit a new application at least sixty (60) days before expiry of the approved one;",
    item12: "Non-compliance with any of the conditions, monitoring or control measures pertaining to other remunerative work may lead to revocation, disciplinary action, and/or legal proceedings and that the sanction imposed may include forfeiture of other remunerative work approval, remuneration and/or benefits gained;",
    item13: "The normal policies and measures governing discipline also apply in terms of non-compliance with the other remunerative work policy and measures;",
    item14: "The Executive Authority or delegated authority can, at any time, terminate my authorisation to perform other remunerative work, based on a change in operational requirements and/or poor performance on my part.",
    item15: "Abide by any control measures applicable to the other remunerative work system, including that it may be required of me to sign in and out each time I enter or exit the institution where I perform my basic or overtime duties;",
    item16: "Attach the certificate of approval when disclosing my financial interests, if applicable."
  };

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicantId, setSelectedApplicantId] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [savingField, setSavingField] = useState("");
  const [savedFields, setSavedFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Clear messages after a delay
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError("");
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  // Fetch applicants by department
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!selectedDepartment) return;
      
      setLoading(true);
      setError("");
      try {
        const q = query(
          collection(db, "applicant"),
          where("sectionA.department", "==", selectedDepartment)
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApplicants(results);
        setSelectedApplicantId("");
        setSelectedApplicant(null);
        setCurrentStep(1);
        setSavedFields([]);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setError("Failed to fetch applicants. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [selectedDepartment]);

  // Fetch selected applicant details
  useEffect(() => {
    const fetchApplicantData = async () => {
      if (!selectedApplicantId) return;
      
      setLoading(true);
      setError("");
      try {
        const docRef = doc(db, "applicant", selectedApplicantId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setSelectedApplicant(data);
          
          // Initialize savedFields from existing supervisorReviewed data
          if (data.supervisorReviewed) {
            setSavedFields(Object.keys(data.supervisorReviewed));
          }
          
          setCurrentStep(1);
        } else {
          setError("Applicant not found.");
        }
      } catch (err) {
        console.error("Error fetching applicant data:", err);
        setError("Failed to fetch applicant details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicantData();
  }, [selectedApplicantId]);

  const saveField = async (fieldKey, value) => {
    if (!selectedApplicantId) return;
    
    setSavingField(fieldKey);
    setError("");
    try {
      const docRef = doc(db, "applicant", selectedApplicantId);
      await updateDoc(docRef, {
        [`supervisorReviewed.${fieldKey}`]: value,
        lastReviewedAt: serverTimestamp(),
      });
      
      setSavedFields((prev) => [...new Set([...prev, fieldKey])]);
      setSuccessMessage(`Field "${fieldKey}" saved successfully!`);
    } catch (err) {
      console.error("Error saving field:", err);
      setError(`Failed to save field "${fieldKey}". Please try again.`);
    } finally {
      setSavingField("");
    }
  };

  const ClickableField = ({ label, value, keyName, type = "text" }) => (
    <div 
      className={`clickable-field ${savedFields.includes(keyName) ? "saved" : ""}`}
      onClick={() => saveField(keyName, value)}
      aria-busy={savingField === keyName}
      tabIndex={0}
      onKeyPress={(e) => e.key === "Enter" && saveField(keyName, value)}
    >
      <strong>{label}:</strong> 
      <span className="field-value">{value || "Not provided"}</span>
      {savingField === keyName && (
        <span className="saving-indicator" aria-live="polite">
          <span className="spinner"></span>
          Saving...
        </span>
      )}
      {savedFields.includes(keyName) && savingField !== keyName && (
        <span className="saved-indicator" aria-live="polite">✓ Saved</span>
      )}
    </div>
  );

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="supervisor-panel">
      <header className="panel-header">
        <h2>Supervisor Review Panel</h2>
        <p>Review and verify applicant details</p>
      </header>

      {/* Status Messages */}
      {error && (
        <div className="message error" role="alert">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="message success" role="status">
          {successMessage}
        </div>
      )}

      {/* Department and Applicant Selection */}
      <div className="selection-panel">
        <div className="form-group">
          <label htmlFor="department-select">Select Department:</label>
          <select
            id="department-select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Choose Department --</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>

        {selectedDepartment && (
          <div className="form-group">
            <label htmlFor="applicant-select">Select Applicant:</label>
            <select
              id="applicant-select"
              value={selectedApplicantId}
              onChange={(e) => setSelectedApplicantId(e.target.value)}
              disabled={loading || applicants.length === 0}
            >
              <option value="">-- Choose Applicant --</option>
              {applicants.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.sectionA?.surname}, {app.sectionA?.firstNames}
                </option>
              ))}
            </select>
            {applicants.length === 0 && !loading && (
              <p className="no-applicants">No applicants found for this department.</p>
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      )}

      {selectedApplicant && (
        <div className="applicant-review-container">
          {/* Progress indicator */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="step-indicators">
              <span className={currentStep >= 1 ? "active" : ""}>Section A</span>
              <span className={currentStep >= 2 ? "active" : ""}>Section B</span>
              <span className={currentStep >= 3 ? "active" : ""}>Section C</span>
              <span className={currentStep >= 4 ? "active" : ""}>Section D</span>
            </div>
          </div>

          {/* STEP 1: SECTION A */}
          {currentStep === 1 && (
            <div className="applicant-details section">
              <h3>SECTION A: Applicant & Job Details</h3>
              <div className="fields-grid">
                <ClickableField label="Surname" value={selectedApplicant.sectionA?.surname} keyName="surname" />
                <ClickableField label="First Names" value={selectedApplicant.sectionA?.firstNames} keyName="firstNames" />
                <ClickableField label="Personnel / Persal Number" value={selectedApplicant.sectionA?.personnelNumber} keyName="personnelNumber" />
                <ClickableField label="Identity Number" value={selectedApplicant.sectionA?.identityNumber} keyName="identityNumber" />
                <ClickableField label="Office Phone" value={selectedApplicant.sectionA?.officePhone} keyName="officePhone" />
                <ClickableField label="Cell Phone" value={selectedApplicant.sectionA?.cellPhone} keyName="cellPhone" />
                <ClickableField label="Email" value={selectedApplicant.sectionA?.email} keyName="email" />
                <ClickableField label="Department" value={selectedApplicant.sectionA?.department} keyName="department" />
                <ClickableField label="Branch / Cluster" value={selectedApplicant.sectionA?.branch} keyName="branch" />
                <ClickableField label="Directorate / Unit" value={selectedApplicant.sectionA?.unit} keyName="unit" />
                <ClickableField label="Job Title & Salary Level" value={selectedApplicant.sectionA?.jobTitle} keyName="jobTitle" />
                <ClickableField label="Professional Body 1" value={selectedApplicant.sectionA?.professionalBody1} keyName="professionalBody1" />
                <ClickableField label="Registration Number 1" value={selectedApplicant.sectionA?.registrationNumber1} keyName="registrationNumber1" />
                <ClickableField label="Professional Body 2" value={selectedApplicant.sectionA?.professionalBody2} keyName="professionalBody2" />
                <ClickableField label="Registration Number 2" value={selectedApplicant.sectionA?.registrationNumber2} keyName="registrationNumber2" />
                <ClickableField label="Professional Body 3" value={selectedApplicant.sectionA?.professionalBody3} keyName="professionalBody3" />
                <ClickableField label="Registration Number 3" value={selectedApplicant.sectionA?.registrationNumber3} keyName="registrationNumber3" />
                <ClickableField label="Job Functions" value={selectedApplicant.sectionA?.jobFunctions} keyName="jobFunctions" />
                <ClickableField label="Designated Employee" value={selectedApplicant.sectionA?.designatedEmployee} keyName="designatedEmployee" />
              </div>

              <div className="navigation-buttons">
                <button className="btn btn-primary" onClick={nextStep}>
                  Next: Section B
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SECTION B */}
          {currentStep === 2 && (
            <div className="applicant-details section">
              <h3>SECTION B: Working Hours & Remunerative Work</h3>
              <div className="fields-grid">
                <ClickableField label="Working Hours (per week)" value={selectedApplicant.sectionB?.workingHours} keyName="workingHours" />
                <ClickableField label="Call / Standby Hours (per week)" value={selectedApplicant.sectionB?.standbyHours} keyName="standbyHours" />
                <ClickableField label="Overtime Hours (per month)" value={selectedApplicant.sectionB?.overtimeHours} keyName="overtimeHours" />
                <ClickableField label="Remunerative Work" value={selectedApplicant.sectionB?.remunerativeWork} keyName="remunerativeWork" />
                <ClickableField label="Other Category" value={selectedApplicant.sectionB?.otherCategory} keyName="otherCategory" />
                <ClickableField label="Description" value={selectedApplicant.sectionB?.remunerativeWorkDescription} keyName="remunerativeWorkDescription" />
                <ClickableField label="Start Date" value={selectedApplicant.sectionB?.startDate} keyName="startDate" />
                <ClickableField label="End Date" value={selectedApplicant.sectionB?.endDate} keyName="endDate" />
              </div>

              <div className="navigation-buttons">
                <button className="btn btn-secondary" onClick={prevStep}>
                  Back
                </button>
                <button className="btn btn-primary" onClick={nextStep}>
                  Next: Section C
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SECTION C */}
          {currentStep === 3 && (
            <div className="applicant-details section">
              <h3>SECTION C: Other Remunerative Work Details</h3>
              
              <div className="table-container">
                <table className="days-table">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Hours</th>
                      <th>Actions</th>
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
                      <tr key={day} className={savedFields.includes(day) ? "saved" : ""}>
                        <td>{day.charAt(0).toUpperCase() + day.slice(1)}</td>
                        <td>{selectedApplicant.sectionC?.[day] || "Not provided"}</td>
                        <td>
                          <button 
                            onClick={() => saveField(day, selectedApplicant.sectionC?.[day])}
                            disabled={savingField === day}
                            className="btn-sm"
                          >
                            {savingField === day ? "Saving..." : "Mark as Reviewed"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="fields-grid">
                <ClickableField label="Total Monthly Hours" value={selectedApplicant.sectionC?.totalMonthlyHours} keyName="totalMonthlyHours" />
                <ClickableField label="Work Address" value={selectedApplicant.sectionC?.workAddress} keyName="workAddress" />
                <ClickableField label="Business Name" value={selectedApplicant.sectionC?.businessName} keyName="businessName" />
                <ClickableField label="Reporting Person" value={selectedApplicant.sectionC?.reportingPerson} keyName="reportingPerson" />
                <ClickableField label="Estimated Income" value={selectedApplicant.sectionC?.estimatedIncome} keyName="estimatedIncome" />
              </div>

              <div className="navigation-buttons">
                <button className="btn btn-secondary" onClick={prevStep}>
                  Back
                </button>
                <button className="btn btn-primary" onClick={nextStep}>
                  Next: Section D
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SECTION D */}
          {currentStep === 4 && (
            <div className="applicant-details section">
              <h3>SECTION D: Declaration</h3>
              <div className="fields-grid">
                <ClickableField label="Full Name" value={selectedApplicant.sectionD?.fullName} keyName="fullName" />
                <ClickableField label="Designation" value={selectedApplicant.sectionD?.designation} keyName="designation" />
                <ClickableField label="Date" value={selectedApplicant.sectionD?.date} keyName="date" />
              </div>
              
              <div className="checked-items">
                <h4>Checked Items:</h4>
                {selectedApplicant.sectionD?.checkedItems && 
                  Object.entries(selectedApplicant.sectionD.checkedItems)
                    .filter(([key, value]) => value)
                    .map(([key]) => (
                      <div 
                        key={key} 
                        className={`checked-item ${savedFields.includes(key) ? "saved" : ""}`}
                        onClick={() => saveField(key, true)}
                      >
                        <span>{sectionDItems[key] || key}</span>
                        <button className="btn-sm">
                          {savedFields.includes(key) ? "✓ Reviewed" : "Mark as Reviewed"}
                        </button>
                      </div>
                    ))
                }
              </div>

              <div className="navigation-buttons">
                <button className="btn btn-secondary" onClick={prevStep}>
                  Back
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/recomm")}
                >
                  Fill a Form
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupervisorPanel;