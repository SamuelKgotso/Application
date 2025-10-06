import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { db } from "./firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp
} from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import "./DocumentUpload.css";

const SectionF = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const successMessage = location.state?.message;
  const applicantId = localStorage.getItem("applicantDocId");

  // ✅ Load any previously saved local files on mount
  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem("localDocuments") || "[]");
    if (savedFiles.length > 0) {
      setFiles(savedFiles.map(f => ({ ...f, status: "uploaded" })));
    }
  }, []);

  // ✅ Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "pending",
      localUrl: URL.createObjectURL(file)
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx"
      ],
      "text/plain": [".txt"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx"
      ]
    },
    maxSize: 10 * 1024 * 1024
  });

  // ✅ Save file locally and to Firestore (metadata only)
  const saveDocument = async (fileObj) => {
    return new Promise(async (resolve, reject) => {
      try {
        const reader = new FileReader();

        reader.onload = async (e) => {
          try {
            if (!applicantId) throw new Error("Applicant ID not found");

            const fileData = {
              id: fileObj.id,
              fileName: fileObj.name,
              fileSize: fileObj.size,
              fileType: fileObj.type,
              localUrl: e.target.result,
              uploadDate: new Date().toISOString(),
              lastModified: fileObj.file.lastModified
            };

            // ✅ Save to localStorage
            const existingFiles = JSON.parse(
              localStorage.getItem("localDocuments") || "[]"
            );
            existingFiles.push(fileData);
            localStorage.setItem("localDocuments", JSON.stringify(existingFiles));

            // ✅ Save to Firestore under same applicant record - FIXED: removed serverTimestamp from arrayUnion
            const docRef = doc(db, "applicant", applicantId);
            await updateDoc(docRef, {
              uploadedDocuments: arrayUnion({
                fileName: fileObj.name,
                fileSize: fileObj.size,
                fileType: fileObj.type,
                localStored: true,
                uploadDate: new Date().toISOString(), // ✅ Use client timestamp instead
                lastAccessed: new Date().toISOString() // ✅ Use client timestamp instead
              }),
              updatedAt: serverTimestamp() // ✅ serverTimestamp only in top-level field
            });

            resolve({ success: true, localPath: fileData.localUrl });
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = () => reject(new Error("File reading failed"));
        reader.readAsDataURL(fileObj.file);
      } catch (error) {
        reject(error);
      }
    });
  };

  // ✅ Upload all selected files
  const uploadFiles = async () => {
    if (files.length === 0) {
      setMessage("Please select files first");
      return;
    }

    setUploading(true);
    setMessage("");
    const results = [];

    for (const fileObj of files) {
      if (fileObj.status === "uploaded") continue;

      try {
        const result = await saveDocument(fileObj);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileObj.id
              ? { ...f, status: "uploaded", localPath: result.localPath }
              : f
          )
        );

        results.push({ fileName: fileObj.name, success: true });
      } catch (error) {
        console.error(`Error saving ${fileObj.name}:`, error);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileObj.id
              ? { ...f, status: "error", error: error.message }
              : f
          )
        );
        results.push({
          fileName: fileObj.name,
          success: false,
          error: error.message
        });
      }
    }

    setUploading(false);
    const successful = results.filter((r) => r.success).length;
    setMessage(
      `Upload complete! ${successful}/${files.length} files saved locally and paths stored in Firestore.`
    );
  };

  // ✅ Remove file from preview
  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // ✅ Clear all selected files
  const clearAll = () => {
    setFiles([]);
    setMessage("");
  };

  // ✅ Load localStorage files manually
  const loadLocalFiles = () => {
    const localFiles = JSON.parse(localStorage.getItem("localDocuments") || "[]");
    console.log("Local files:", localFiles);
    alert(
      `You have ${localFiles.length} files stored locally. Check console for details.`
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("image")) return "🖼️";
    if (fileType.includes("word")) return "📝";
    if (fileType.includes("excel") || fileType.includes("sheet")) return "📊";
    return "📁";
  };

  return (
    <div className="document-upload-container">
      <h2>SECTION F: DOCUMENT UPLOAD</h2>
      <p className="subtitle">
        Upload your supporting documents. Files are stored in your browser and
        metadata in Firestore.
      </p>

      {successMessage && (
        <div className="message success">{successMessage}</div>
      )}

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <div className="upload-icon">📁</div>
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <div>
              <p>Drag & drop files here, or click to select</p>
              <small>
                Supported: PDF, DOC, DOCX, TXT, Images, Excel (Max 10MB each)
              </small>
            </div>
          )}
        </div>
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="files-section">
          <div className="section-header">
            <h3>Selected Files ({files.length})</h3>
            <button onClick={clearAll} className="clear-btn">
              Clear All
            </button>
          </div>

          <div className="files-list">
            {files.map((fileObj) => (
              <div key={fileObj.id} className={`file-item ${fileObj.status}`}>
                <div className="file-icon">{getFileIcon(fileObj.type)}</div>
                <div className="file-details">
                  <div className="file-name">{fileObj.name}</div>
                  <div className="file-meta">
                    {formatFileSize(fileObj.size)} • {fileObj.type}
                  </div>
                  {fileObj.status === "uploaded" && (
                    <div className="file-status success">✓ Stored locally</div>
                  )}
                  {fileObj.status === "error" && (
                    <div className="file-status error">✗ {fileObj.error}</div>
                  )}
                </div>

                <div className="file-actions">
                  {fileObj.localUrl && (
                    <a
                      href={fileObj.localUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="preview-btn"
                    >
                      Preview
                    </a>
                  )}
                  <button
                    onClick={() => removeFile(fileObj.id)}
                    className="remove-btn"
                    disabled={uploading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={uploadFiles}
            disabled={uploading || files.every((f) => f.status === "uploaded")}
            className="upload-btn"
          >
            {uploading ? "Saving..." : `Save ${files.length} File(s) Locally`}
          </button>
        </div>
      )}

      {/* Status Message */}
      {message && (
        <div
          className={`message ${message.includes("Error") ? "error" : "success"}`}
        >
          {message}
        </div>
      )}

      {/* Info Section */}
      <div className="storage-info">
        <h4>Storage Information</h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Storage Location:</span>
            <span className="info-value">Browser Local Storage</span>
          </div>
          <div className="info-item">
            <span className="info-label">Metadata Storage:</span>
            <span className="info-value">Firebase Firestore</span>
          </div>
          <div className="info-item">
            <span className="info-label">File Access:</span>
            <span className="info-value">Direct preview in browser</span>
          </div>
        </div>

        <button onClick={loadLocalFiles} className="storage-btn">
          Check Local Storage
        </button>
      </div>
    </div>
  );
};

export default SectionF;