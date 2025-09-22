import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "./firebase";
import "./DocumentUpload.css";

export default function SectionF() {
  const navigate = useNavigate();
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
      } else {
        navigate("/login");
      }
    });
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
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          </button>
        </div>
      </form>
    </div>
  );
}