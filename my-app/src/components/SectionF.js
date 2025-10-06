import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import "./DocumentUpload.css";

export default function SectionF() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [applicantDocId, setApplicantDocId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [agreedToDeclaration, setAgreedToDeclaration] = useState(false);

  const [documents, setDocuments] = useState({
    idDocument: { file: null, url: "", name: "ID Document", required: true, uploaded: false },
    qualifications: { file: null, url: "", name: "Qualifications", required: true, uploaded: false },
    proofOfRegistration: { file: null, url: "", name: "Proof of Registration", required: false, uploaded: false },
    cv: { file: null, url: "", name: "Curriculum Vitae", required: true, uploaded: false }
  });

  // ✅ Show success message when redirected from Section D
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // ✅ Check form validity whenever documents change
  useEffect(() => {
    const requiredDocsUploaded = Object.entries(documents)
      .filter(([_, docData]) => docData.required)
      .every(([_, docData]) => docData.file !== null);
    
    setFormValid(requiredDocsUploaded && agreedToDeclaration);
  }, [documents, agreedToDeclaration]);

  // ✅ Load existing documents if any
  useEffect(() => {
    const fetchExistingDocuments = async () => {
      const savedDocId = localStorage.getItem("applicantDocId");
      if (!savedDocId) return;

      try {
        const docRef = doc(db, "applicant", savedDocId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().documents) {
          const existingDocs = docSnap.data().documents;
          setDocuments(prev => {
            const updatedDocs = { ...prev };
            Object.keys(existingDocs).forEach(docType => {
              if (updatedDocs[docType]) {
                updatedDocs[docType] = {
                  ...updatedDocs[docType],
                  url: existingDocs[docType].url,
                  uploaded: true
                };
              }
            });
            return updatedDocs;
          });
        }
      } catch (error) {
        console.error("Error loading existing documents:", error);
      }
    };

    fetchExistingDocuments();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const savedDocId = localStorage.getItem("applicantDocId");
        if (savedDocId) {
          setApplicantDocId(savedDocId);
          
          // ✅ Check if Section D is completed
          try {
            const docRef = doc(db, "applicant", savedDocId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (!data.sectionD) {
                alert("Please complete Section D first.");
                navigate("/appform/section-d");
                return;
              }
            }
          } catch (error) {
            console.error("Error checking prerequisites:", error);
          }
        } else {
          alert("No application record found. Please start from Section A.");
          navigate("/appform/section-a");
        }
      } else {
        navigate("/login");
      }
    });

    return unsubscribe;
  }, [navigate]);

  const handleFileChange = (documentType, event) => {
    const file = event.target.files[0];
    if (file) {
      if (!validateFile(file)) return;

      setDocuments(prev => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          file: file,
          url: "",
          uploaded: false
        }
      }));

      setUploadProgress(prev => ({
        ...prev,
        [documentType]: 0
      }));
    }
  };

  const validateFile = (file) => {
    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      alert("❌ Please upload a valid file type (PDF, DOC, DOCX, JPEG, PNG)");
      return false;
    }

    if (file.size > maxSize) {
      alert("❌ File size must be less than 10MB");
      return false;
    }

    return true;
  };

  // ✅ UPDATED: Fixed upload function with better error handling
  const uploadDocument = async (documentType, file) => {
    if (!currentUser || !file) {
      console.error("❌ Missing user or file");
      return null;
    }

    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${documentType}_${Date.now()}.${fileExtension}`;
      
      // ✅ UPDATED: Use a more structured path for better organization
      const storageRef = ref(storage, `applicants/${currentUser.uid}/documents/${fileName}`);

      console.log("📤 Starting upload for:", documentType);
      console.log("📁 File path:", `applicants/${currentUser.uid}/documents/${fileName}`);

      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      console.log("✅ Upload completed for:", documentType);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("🔗 Download URL obtained for:", documentType);
      
      return downloadURL;
    } catch (error) {
      console.error(`❌ Error uploading ${documentType}:`, error);
      
      // More specific error handling
      if (error.code === 'storage/unauthorized') {
        alert(`❌ Upload failed: You don't have permission to upload files. Please check Firebase Storage rules.`);
      } else if (error.code === 'storage/canceled') {
        alert(`❌ Upload canceled for ${documentType}`);
      } else if (error.code === 'storage/unknown') {
        alert(`❌ Unknown error occurred during upload. Please check your internet connection.`);
      } else {
        alert(`❌ Failed to upload ${documentType}: ${error.message}`);
      }
      
      throw error;
    }
  };

  const saveDocumentReferences = async (documentUrls) => {
    if (!applicantDocId) {
      throw new Error("No applicant document ID found");
    }

    const applicantRef = doc(db, "applicant", applicantDocId);
    await updateDoc(applicantRef, {
      documents: documentUrls,
      sectionE: {
        completed: true,
        completedAt: serverTimestamp(),
        documents: Object.keys(documentUrls),
        agreedToDeclaration: agreedToDeclaration
      },
      updatedAt: serverTimestamp(),
      status: "documents_uploaded"
    });
    
    return applicantDocId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("❌ You must be logged in to upload documents");
      navigate("/login");
      return;
    }

    if (!formValid) {
      alert("❌ Please upload all required documents and agree to the declaration before submitting.");
      return;
    }

    if (!agreedToDeclaration) {
      alert("❌ Please agree to the declaration before submitting.");
      return;
    }

    setLoading(true);

    try {
      const documentUrls = {};

      // Upload all documents with better error handling
      for (const [docType, docData] of Object.entries(documents)) {
        if (docData.file && !docData.uploaded) {
          console.log(`🔄 Uploading ${docType}...`);
          setUploadProgress(prev => ({ ...prev, [docType]: 30 }));
          
          try {
            const url = await uploadDocument(docType, docData.file);
            if (url) {
              documentUrls[docType] = {
                url: url,
                name: docData.name,
                fileName: docData.file.name,
                uploadedAt: new Date().toISOString(),
                size: docData.file.size,
                type: docData.file.type
              };
              setUploadProgress(prev => ({ ...prev, [docType]: 100 }));
              
              // Update local state to mark as uploaded
              setDocuments(prev => ({
                ...prev,
                [docType]: {
                  ...prev[docType],
                  uploaded: true,
                  url: url
                }
              }));
              
              console.log(`✅ Successfully uploaded ${docType}`);
            }
          } catch (uploadError) {
            console.error(`❌ Failed to upload ${docType}:`, uploadError);
            setUploadProgress(prev => ({ ...prev, [docType]: 0 }));
            throw uploadError; // Re-throw to stop the process
          }
        } else if (docData.uploaded && docData.url) {
          // Keep existing uploaded documents
          documentUrls[docType] = {
            url: docData.url,
            name: docData.name,
            fileName: docData.file?.name || docData.name,
            uploadedAt: new Date().toISOString(),
            existing: true
          };
        }
      }

      console.log("💾 Saving document references to Firestore...");
      await saveDocumentReferences(documentUrls);
      
      console.log("✅ All documents uploaded and saved successfully!");
      alert("✅ Documents uploaded successfully!");
      
      navigate("/confirmation", { 
        state: { message: "All documents have been uploaded successfully!" } 
      });

    } catch (error) {
      console.error("❌ Error uploading documents:", error);
      alert("❌ Failed to upload documents. Please try again. Check the console for details.");
    } finally {
      setLoading(false);
      setUploadProgress({});
    }
  };

  const removeDocument = (documentType) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: {
        ...prev[documentType],
        file: null,
        url: "",
        uploaded: false
      }
    }));
  };

  const getUploadStatus = (docData) => {
    if (docData.uploaded) return "uploaded";
    if (docData.file) return "ready";
    return "missing";
  };

  return (
    <div className="document-upload-container">
      <h2>SECTION E: DOCUMENT UPLOAD</h2>
      
      {/* ✅ Success Message Display */}
      {successMessage && (
        <div className="success-message">
          ✅ {successMessage}
        </div>
      )}
      
      {currentUser && (
        <div className="upload-user-info">
          <p>Uploading as: <strong>{currentUser.email}</strong></p>
          <p>User ID: <strong>{currentUser.uid}</strong></p>
          {applicantDocId && (
            <p>Application ID: <strong>{applicantDocId}</strong></p>
          )}
        </div>
      )}

      <div className="upload-info">
        <p>Please upload the following documents (PDF, DOC, DOCX, JPEG, PNG - Max 10MB each):</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="documents-grid">
          {Object.entries(documents).map(([docType, docData]) => {
            const status = getUploadStatus(docData);
            return (
              <div 
                key={docType} 
                className={`document-upload-section ${docData.required ? 'required' : ''} ${status}`}
              >
                <div className="document-header">
                  <label className={`document-label ${docData.required ? 'required' : ''}`}>
                    {docData.name} {docData.required && '*'}
                  </label>
                  <span className={`status-indicator ${status}`}>
                    {status === 'uploaded' && '✅ Uploaded'}
                    {status === 'ready' && '📁 Ready to upload'}
                    {status === 'missing' && '❌ Missing'}
                  </span>
                </div>
                
                <div className="file-input-group">
                  <input
                    type="file"
                    id={docType}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileChange(docType, e)}
                    className="file-input"
                    disabled={loading}
                  />
                  <label htmlFor={docType} className="file-input-button">
                    {docData.uploaded ? 'Change File' : 'Choose File'}
                  </label>
                  <span className={`file-name ${docData.file ? 'has-file' : ''}`}>
                    {docData.file ? docData.file.name : "No file chosen"}
                  </span>
                </div>

                {docData.file && (
                  <button 
                    type="button" 
                    className="remove-file-btn"
                    onClick={() => removeDocument(docType)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}

                {uploadProgress[docType] > 0 && uploadProgress[docType] < 100 && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress[docType]}%` }}
                    >
                      {uploadProgress[docType]}%
                    </div>
                  </div>
                )}

                {docData.url && (
                  <div className="document-preview">
                    <small>
                      <a href={docData.url} target="_blank" rel="noopener noreferrer">
                        📄 View uploaded document
                      </a>
                    </small>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Declaration Section */}
        <div className="declaration-section">
          <h3>Declaration</h3>
          <div className="declaration-text">
            <p>
              I hereby declare that all the documents submitted are true, correct, and belong to me. I understand that
              providing false information may result in the rejection of my application or termination of any approval
              granted based on this application.
            </p>
          </div>
          <div className="declaration-agreement">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={agreedToDeclaration}
                onChange={() => setAgreedToDeclaration(!agreedToDeclaration)}
                disabled={loading}
              />
              <span className="checkmark"></span>
              I agree to the above declaration
            </label>
          </div>
        </div>

        <div className="file-requirements">
          <h4>📋 File Requirements:</h4>
          <ul>
            <li>Maximum file size: 10MB per document</li>
            <li>Accepted formats: PDF, DOC, DOCX, JPEG, PNG</li>
            <li>Required documents are marked with <strong>*</strong></li>
            <li>Ensure documents are clear and readable</li>
            <li>You can replace documents by choosing a new file</li>
          </ul>
        </div>

        <div className="form-validation">
          <p className={formValid ? "valid" : "invalid"}>
            {formValid 
              ? "✅ All required documents are ready for upload and declaration agreed!" 
              : "❌ Please upload all required documents marked with * and agree to the declaration"
            }
          </p>
        </div>

        <div className="upload-button-row">
          <button 
            type="button" 
            className="back-btn"
            onClick={() => navigate("/appform/section-d")}
            disabled={loading}
          >
            ← Back to Section D
          </button>
          <button 
            type="submit" 
            className="upload-submit-btn"
            disabled={loading || !formValid}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Uploading Documents...
              </>
            ) : (
              "✅ Submit Documents"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}