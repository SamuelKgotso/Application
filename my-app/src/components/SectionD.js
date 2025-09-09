import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";
import "./FormStyles.css";

export default function SectionD() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    checkedItems: {},
    designation: "",
    date: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [clickedMessage, setClickedMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const applicantId = localStorage.getItem("applicantDocId");

  // ✅ Check authenticated user
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

  // ✅ Load saved Section D data
  useEffect(() => {
    if (!applicantId) return;
    const fetchData = async () => {
      try {
        const docRef = doc(db, "applicant", applicantId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().sectionD) {
          setFormData((prev) => ({
            ...prev,
            ...docSnap.data().sectionD,
          }));
        }
      } catch (error) {
        console.error("❌ Error loading Section D data:", error);
      }
    };
    fetchData();
  }, [applicantId]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle checkbox clicks
  const handleItemClick = async (name, message) => {
    const updatedCheckedItems = {
      ...formData.checkedItems,
      [name]: !formData.checkedItems[name],
    };

    const updatedFormData = {
      ...formData,
      checkedItems: updatedCheckedItems,
    };

    setFormData(updatedFormData);
    setClickedMessage(message);

    try {
      if (!applicantId) return;
      const docRef = doc(db, "applicant", applicantId);

      await updateDoc(docRef, {
        sectionD: updatedFormData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("❌ Error saving clicked item:", error);
    }
  };

  // ✅ Submit Section D - UPDATED TO REDIRECT TO HOME
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!applicantId) {
        alert("⚠️ No applicant record found. Please complete Section A first.");
        return;
      }
      const docRef = doc(db, "applicant", applicantId);

      await updateDoc(docRef, {
        sectionD: formData,
        updatedAt: serverTimestamp(),
      });

      // Redirect to home page after successful submission
      navigate("/", { state: { message: "Successfully submitted!" } });
    } catch (error) {
      console.error("❌ Error saving Section D:", error);
      alert("Failed to save Section D. Please try again.");
    }
  };

  const step1Items = [
    "The information supplied in this application form is accurate and truthful;",
    "My performance of other remunerative work will in no way interfere with my commitments to the department, my duties and responsibilities as an employee;",
    "My performance of other remunerative work will not take place during the hours I am required for duty as agreed in my employment contract;",
    "I will not use any state resources for the purpose of performing other remunerative work;",
    "I shall not conduct business with any organ of the state, either in person or as part of an entity (including non-profit organisations);",
    "I will only be involved in the other remunerative work I have applied for; and",
    "This application has been discussed with my supervisor.",
    "External work details: The nature of external work, hours per week/month, estimated income, and work address",
  ];

  const step2Items = [
    "My first commitment is to meet the operational objectives of my department and undertake to assist, to the best of my ability, the department in meeting its service delivery demands, including overtime commitments (if applicable) and being on call/standby (when applicable) as scheduled.",
    "Permission to perform other remunerative work is only granted for the work applied for and time agreed upon (and reflected on the certificate of approval);",
    "Should I wish to continue with such other remunerative work, I must submit a new application at least sixty (60) days before expiry of the approved one;",
    "Non-compliance with any of the conditions, monitoring or control measures pertaining to other remunerative work may lead to revocation, disciplinary action, and/or legal proceedings and that the sanction imposed may include forfeiture of other remunerative work approval, remuneration and/or benefits gained;",
    "The normal policies and measures governing discipline also apply in terms of non-compliance with the other remunerative work policy and measures;",
    "The Executive Authority or delegated authority can, at any time, terminate my authorisation to perform other remunerative work, based on a change in operational requirements and/or poor performance on my part.",
    "Abide by any control measures applicable to the other remunerative work system, including that it may be required of me to sign in and out each time I enter or exit the institution where I perform my basic or overtime duties;",
    "Attach the certificate of approval when disclosing my financial interests, if applicable.",
  ];

  const renderStepItems = (items, startIndex) => (
    <table className="days-table">
      <tbody>
        {items.map((text, index) => {
          const itemKey = `item${startIndex + index}`;
          return (
            <tr key={itemKey}>
              <td>{startIndex + index}.</td>
              <td
                style={{ cursor: "pointer" }}
                onClick={() => handleItemClick(itemKey, text)}
              >
                {text}
              </td>
              <td style={{ textAlign: "center", width: "40px" }}>
                <input
                  type="checkbox"
                  name={itemKey}
                  checked={formData.checkedItems[itemKey] || false}
                  onChange={() => handleItemClick(itemKey, text)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="form-container">
      <h2>SECTION D: DECLARATION BY THE APPLICANT</h2>

      {currentUser && (
        <div className="user-info">
          <p>
            Submitting as: <strong>{currentUser.email}</strong>
          </p>
        </div>
      )}

      <form className="applicant-form" onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <>
            <label className="full-width-label">
              I (full name(s) and surname),
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </label>
            <p style={{ marginTop: "20px" }}>
              <strong>Hereby confirm that:</strong>
            </p>
            {renderStepItems(step1Items, 1)}
          </>
        )}

        {currentStep === 2 && (
          <>
            <p>
              <strong>I understand and acknowledge that:</strong>
            </p>
            {renderStepItems(step2Items, 9)}
          </>
        )}

        {currentStep === 3 && (
          <div className="signature-section">
            <label>
              Designation:
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        )}

        <div className="button-row">
          {currentStep > 1 && (
            <button
              type="button"
              className="back-btn"
              onClick={() => setCurrentStep((p) => p - 1)}
            >
              Back
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              className="continue-button"
              onClick={() => setCurrentStep((p) => p + 1)}
            >
              Next
            </button>
          ) : (
            <button type="submit" className="continue-button">
              Submit Declaration
            </button>
          )}
        </div>

        {clickedMessage && (
          <p style={{ marginTop: "10px", color: "green" }}>
            <strong>Last Clicked:</strong> {clickedMessage}
          </p>
        )}
      </form>
    </div>
  );
}