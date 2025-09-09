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

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicantId, setSelectedApplicantId] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [savingField, setSavingField] = useState("");
  const [savedFields, setSavedFields] = useState([]);

  // Fetch applicants by department
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!selectedDepartment) return;
      const q = query(
        collection(db, "applicant"),
        where("department", "==", selectedDepartment)
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
    };
    fetchApplicants();
  }, [selectedDepartment]);

  // Fetch selected applicant details
  useEffect(() => {
    const fetchApplicantData = async () => {
      if (!selectedApplicantId) return;
      const docRef = doc(db, "applicant", selectedApplicantId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSelectedApplicant({ id: docSnap.id, ...docSnap.data() });
        setCurrentStep(1);
        setSavedFields([]);
      }
    };
    fetchApplicantData();
  }, [selectedApplicantId]);

  const saveField = async (fieldKey, value) => {
    if (!selectedApplicantId) return;
    setSavingField(fieldKey);
    try {
      const docRef = doc(db, "applicant", selectedApplicantId);
      await updateDoc(docRef, {
        [`supervisorReviewed.${fieldKey}`]: value,
        lastReviewedAt: serverTimestamp(),
      });
      setSavedFields((prev) => [...new Set([...prev, fieldKey])]);
    } catch (err) {
      console.error("Error saving field:", err);
    } finally {
      setSavingField("");
    }
  };

  const clickableP = (label, value, keyName) => (
    <p
      className={`clickable-field ${
        savedFields.includes(keyName) ? "saved" : ""
      }`}
      onClick={() => saveField(keyName, value)}
    >
      <strong>{label}:</strong> {value}{" "}
      {savingField === keyName && <span className="saving">Saving...</span>}
    </p>
  );

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="supervisor-panel">
      <h2>Supervisor Panel - Applicant Details</h2>

      {/* Department Selector */}
      <label>Select Department:</label>
      <select
        value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
      >
        <option value="">-- Choose Department --</option>
        {departments.map((dep) => (
          <option key={dep} value={dep}>
            {dep}
          </option>
        ))}
      </select>

      {/* Applicant Selector */}
      {selectedDepartment && (
        <>
          <label>Select Applicant:</label>
          <select
            value={selectedApplicantId}
            onChange={(e) => setSelectedApplicantId(e.target.value)}
          >
            <option value="">-- Choose Applicant --</option>
            {applicants.map((app) => (
              <option key={app.id} value={app.id}>
                {app.surname}, {app.firstNames}
              </option>
            ))}
          </select>
        </>
      )}

      {selectedApplicant && (
        <>
          {/* STEP 1: SECTION A */}
          {currentStep === 1 && (
            <div className="applicant-details">
              <h3>SECTION A: Applicant & Job Details</h3>
              {clickableP("Surname", selectedApplicant.surname, "surname")}
              {clickableP(
                "First Names",
                selectedApplicant.firstNames,
                "firstNames"
              )}
              {clickableP(
                "Personnel / Persal Number",
                selectedApplicant.personnelNumber,
                "personnelNumber"
              )}
              {clickableP(
                "Identity Number",
                selectedApplicant.identityNumber,
                "identityNumber"
              )}
              {clickableP(
                "Office Phone",
                selectedApplicant.officePhone,
                "officePhone"
              )}
              {clickableP(
                "Cell Phone",
                selectedApplicant.cellPhone,
                "cellPhone"
              )}
              {clickableP("Email", selectedApplicant.email, "email")}
              {clickableP(
                "Department",
                selectedApplicant.department,
                "department"
              )}
              {clickableP("Branch / Cluster", selectedApplicant.branch, "branch")}
              {clickableP(
                "Directorate / Unit",
                selectedApplicant.unit,
                "unit"
              )}
              {clickableP(
                "Job Title & Salary Level",
                selectedApplicant.jobTitle,
                "jobTitle"
              )}
              {clickableP(
                "Professional Body 1",
                selectedApplicant.professionalBody1,
                "professionalBody1"
              )}
              {clickableP(
                "Registration Number 1",
                selectedApplicant.registrationNumber1,
                "registrationNumber1"
              )}
              {clickableP(
                "Professional Body 2",
                selectedApplicant.professionalBody2,
                "professionalBody2"
              )}
              {clickableP(
                "Registration Number 2",
                selectedApplicant.registrationNumber2,
                "registrationNumber2"
              )}
              {clickableP(
                "Professional Body 3",
                selectedApplicant.professionalBody3,
                "professionalBody3"
              )}
              {clickableP(
                "Registration Number 3",
                selectedApplicant.registrationNumber3,
                "registrationNumber3"
              )}
              {clickableP(
                "Job Functions",
                selectedApplicant.jobFunctions,
                "jobFunctions"
              )}
              {clickableP(
                "Designated Employee",
                selectedApplicant.designatedEmployee,
                "designatedEmployee"
              )}

              <button className="continue-button" onClick={nextStep}>
                Next: Section B
              </button>
            </div>
          )}

          {/* STEP 2: SECTION B */}
          {currentStep === 2 && (
            <div className="applicant-details">
              <h3>SECTION B: Working Hours & Remunerative Work</h3>
              {clickableP(
                "Working Hours (per week)",
                selectedApplicant.workingHours,
                "workingHours"
              )}
              {clickableP(
                "Call / Standby Hours (per week)",
                selectedApplicant.standbyHours,
                "standbyHours"
              )}
              {clickableP(
                "Overtime Hours (per month)",
                selectedApplicant.overtimeHours,
                "overtimeHours"
              )}
              {clickableP(
                "Remunerative Work",
                selectedApplicant.remunerativeWork,
                "remunerativeWork"
              )}
              {clickableP(
                "Other Category",
                selectedApplicant.otherCategory,
                "otherCategory"
              )}
              {clickableP(
                "Description",
                selectedApplicant.remunerativeWorkDescription,
                "remunerativeWorkDescription"
              )}
              {clickableP("Start Date", selectedApplicant.startDate, "startDate")}
              {clickableP("End Date", selectedApplicant.endDate, "endDate")}

              <button className="back-btn" onClick={prevStep}>
                Back
              </button>
              <button className="continue-button" onClick={nextStep}>
                Next: Section C
              </button>
            </div>
          )}

          {/* STEP 3: SECTION C */}
          {currentStep === 3 && (
            <div className="applicant-details">
              <h3>SECTION C: Other Remunerative Work Details</h3>
              <table className="days-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Hours</th>
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
                      <td>{selectedApplicant[day]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {clickableP(
                "Total Monthly Hours",
                selectedApplicant.totalMonthlyHours,
                "totalMonthlyHours"
              )}
              {clickableP(
                "Work Address",
                selectedApplicant.workAddress,
                "workAddress"
              )}
              {clickableP(
                "Business Name",
                selectedApplicant.businessName,
                "businessName"
              )}
              {clickableP(
                "Reporting Person",
                selectedApplicant.reportingPerson,
                "reportingPerson"
              )}
              {clickableP(
                "Estimated Income",
                selectedApplicant.estimatedIncome,
                "estimatedIncome"
              )}

              <button className="back-btn" onClick={prevStep}>
                Back
              </button>
              <button className="continue-button" onClick={nextStep}>
                Next: Section D
              </button>
            </div>
          )}

          {/* STEP 4: SECTION D */}
          {currentStep === 4 && (
            <div className="applicant-details">
              <h3>SECTION D: Declaration</h3>
              {clickableP(
                "Full Name",
                selectedApplicant.sectionD?.fullName,
                "fullName"
              )}
              {clickableP(
                "Designation",
                selectedApplicant.sectionD?.designation,
                "designation"
              )}
              {clickableP("Date", selectedApplicant.sectionD?.date, "date")}
              <p>
                <strong>Checked Items:</strong>
              </p>
              <ul>
                {selectedApplicant.sectionD &&
                  Object.entries(selectedApplicant.sectionD.checkedItems || {}).map(
                    ([key, value]) => value && <li key={key}>{key}</li>
                  )}
              </ul>

              <button className="back-btn" onClick={prevStep}>
                Back
              </button>
              <button
                className="continue-button"
                onClick={() =>
                  navigate(`/appform/recomm/${selectedApplicantId}`)
                }
              >
                Fill a Form
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SupervisorPanel;
