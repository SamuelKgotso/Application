import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
=======
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "./firebase";
>>>>>>> c5858224f89e56456b803fc7c7eba4f6c24f0df4
import "./DocumentUpload.css";

export default function SectionF() {
  const navigate = useNavigate();
<<<<<<< HEAD
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [applicantDocId, setApplicantDocId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formValid, setFormValid] = useState(false);

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
    
    setFormValid(requiredDocsUploaded);
  }, [documents]);

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
=======
  const [documents, setDocuments] = useState([
    { id: 1, name: "Identification Document", file: null, preview: null, required: true },
    { id: 2, name: "Academic Certificate", file: null, preview: null, required: true },
    { id: 3, name: "Proof of Address", file: null, preview: null, required: true },
    { id: 4, name: "Professional License", file: null, preview: null, required: true },
    { id: 5, name: "Additional Supporting Document", file: null, preview: null, required: false },
  ]);
  const [agreedToDeclaration, setAgreedToDeclaration] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authenticated user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
>>>>>>> c5858224f89e56456b803fc7c7eba4f6c24f0df4
      } else {
        navigate("/login");
      }
    });
<<<<<<< HEAD

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
=======
    return unsubscribe;
  }, [navigate]);

  const handleFileChange = (id, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please choose a smaller file.");
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
>>>>>>> c5858224f89e56456b803fc7c7eba4f6c24f0df4
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
<<<<<<< HEAD
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

  const uploadDocument = async (documentType, file) => {
    if (!currentUser || !file) return null;

    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${documentType}_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `documents/${currentUser.uid}/${fileName}`);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error(`❌ Error uploading ${documentType}:`, error);
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
        documents: Object.keys(documentUrls)
      },
      updatedAt: serverTimestamp(),
      status: "documents_uploaded"
    });
    
    return applicantDocId;
=======
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid file type (PDF, JPEG, PNG, DOC, DOCX)");
      return;
    }

    const updatedDocuments = documents.map((doc) =>
      doc.id === id
        ? { ...doc, file, preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null }
        : doc
    );

    setDocuments(updatedDocuments);

    setUploadStatus((prev) => ({
      ...prev,
      [id]: "ready",
    }));
  };

  const removeFile = (id) => {
    const updatedDocuments = documents.map((doc) => {
      if (doc.id === id) {
        if (doc.preview) URL.revokeObjectURL(doc.preview);
        return { ...doc, file: null, preview: null };
      }
      return doc;
    });

    setDocuments(updatedDocuments);
    setUploadStatus((prev) => ({
      ...prev,
      [id]: null,
    }));
  };

  const uploadFileToStorage = async (file, fileName, userId) => {
    try {
      // Create a unique filename to avoid conflicts
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `${fileName}_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `applicants/${userId}/${uniqueFileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }
>>>>>>> c5858224f89e56456b803fc7c7eba4f6c24f0df4
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    
    if (!currentUser) {
      alert("❌ You must be logged in to upload documents");
      navigate("/login");
      return;
    }

    if (!formValid) {
      alert("❌ Please upload all required documents before submitting.");
      return;
    }

    setLoading(true);

    try {
      const documentUrls = {};

      // Upload all documents
      for (const [docType, docData] of Object.entries(documents)) {
        if (docData.file && !docData.uploaded) {
          setUploadProgress(prev => ({ ...prev, [docType]: 50 }));
          
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

      await saveDocumentReferences(documentUrls);
      alert("✅ Documents uploaded successfully!");
      navigate("/confirmation", { 
        state: { message: "All documents have been uploaded successfully!" } 
      });

    } catch (error) {
      console.error("❌ Error uploading documents:", error);
      alert("❌ Failed to upload documents. Please try again.");
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
              ? "✅ All required documents are ready for upload!" 
              : "❌ Please upload all required documents marked with *"
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
=======
    setIsSubmitting(true);

    if (!agreedToDeclaration) {
      alert("Please agree to the declaration before submitting");
      setIsSubmitting(false);
      return;
    }

    const requiredDocsUploaded = documents
      .filter((doc) => doc.required)
      .every((doc) => doc.file !== null);

    if (!requiredDocsUploaded) {
      alert("Please upload all required documents");
      setIsSubmitting(false);
      return;
    }

    try {
      const userId = currentUser?.uid;
      if (!userId) {
        alert("User not authenticated. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      // Upload each file with better error handling
      const uploadPromises = documents
        .filter((doc) => doc.file)
        .map(async (doc) => {
          setUploadStatus((prev) => ({ ...prev, [doc.id]: "uploading" }));
          try {
            const downloadURL = await uploadFileToStorage(
              doc.file, 
              `doc_${doc.id}`, 
              userId
            );
            return { 
              id: doc.id, 
              name: doc.name, 
              url: downloadURL,
              fileName: doc.file.name,
              uploadedAt: new Date().toISOString()
            };
          } catch (error) {
            setUploadStatus((prev) => ({ ...prev, [doc.id]: "error" }));
            throw error;
          }
        });

      const uploadedDocuments = await Promise.all(uploadPromises);

      // Convert array to object for Firestore
      const documentsObject = uploadedDocuments.reduce((obj, item) => {
        obj[item.id] = { 
          name: item.name, 
          url: item.url,
          fileName: item.fileName,
          uploadedAt: item.uploadedAt
        };
        return obj;
      }, {});

      // Save to Firestore - using setDoc with merge instead of updateDoc
      const docRef = doc(db, "applicant", userId);
      await setDoc(docRef, {
        sectionE: {
          documents: documentsObject,
          agreedToDeclaration,
          submittedAt: serverTimestamp(),
          status: "completed"
        },
        userId: userId,
        email: currentUser.email,
        updatedAt: serverTimestamp(),
      }, { merge: true }); // merge: true ensures we don't overwrite other fields

      alert("Documents submitted successfully!");
      navigate("/", { 
        state: { 
          message: "Documents successfully uploaded!",
          timestamp: new Date().toLocaleString()
        } 
      });
    } catch (error) {
      console.error("Error uploading documents:", error);
      alert(`Failed to upload documents: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add cleanup for object URLs
  useEffect(() => {
    return () => {
      documents.forEach(doc => {
        if (doc.preview) {
          URL.revokeObjectURL(doc.preview);
        }
      });
    };
  }, []);

  return (
    <div className="form-container">
      <h2>SECTION E: DOCUMENT UPLOAD</h2>

      {currentUser && (
        <div className="user-info">
          <p>
            Uploading as: <strong>{currentUser.email}</strong>
          </p>
        </div>
      )}

      <p className="instructions">
        Please upload the following documents. All required documents must be submitted to complete your application.
        <br />
        <strong>Allowed formats: PDF, JPEG, PNG, DOC, DOCX (Max 5MB each)</strong>
      </p>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="documents-grid">
          {documents.map((docItem) => (
            <div key={docItem.id} className="document-card">
              <h3>
                {docItem.name}
                {!docItem.required && <span className="optional">(Optional)</span>}
              </h3>
              <div className="file-input-container">
                <label className="file-input-label">
                  {docItem.file ? "Change File" : "Select File"}
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(docItem.id, e)}
                    className="file-input"
                    disabled={isSubmitting}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </label>
              </div>

              {docItem.file && (
                <div className="preview-container">
                  <div className="file-info">
                    <span className="file-name">{docItem.file.name}</span>
                    <span className="file-size">
                      ({(docItem.file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>

                  {docItem.preview ? (
                    <img src={docItem.preview} alt="Preview" className="preview-image" />
                  ) : (
                    <div className="file-preview">
                      <div className="file-icon">📄</div>
                      <p className="file-type">{docItem.file.type.split("/")[1] || "file"}</p>
                    </div>
                  )}

                  {uploadStatus[docItem.id] === "uploading" ? (
                    <div className="upload-progress">Uploading...</div>
                  ) : uploadStatus[docItem.id] === "error" ? (
                    <div className="upload-error">Upload failed</div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeFile(docItem.id)}
                      className="remove-btn"
                      disabled={isSubmitting}
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

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
                disabled={isSubmitting}
              />
              <span className="checkmark"></span>
              I agree to the above declaration
            </label>
          </div>
        </div>

        <div className="button-row">
          <button type="button" className="back-btn" onClick={() => navigate(-1)} disabled={isSubmitting}>
            Back
          </button>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={!agreedToDeclaration || isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Submit Documents"}
>>>>>>> c5858224f89e56456b803fc7c7eba4f6c24f0df4
          </button>
        </div>
      </form>
    </div>
  );
}