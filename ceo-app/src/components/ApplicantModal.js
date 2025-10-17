// components/ApplicantModal.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { db, storage } from './firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import './ApplicantModal.css';

const ApplicantModal = ({ applicant, onClose }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [declarationItems, setDeclarationItems] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  
  useEffect(() => {
    if (applicant?.sectionC) {
      const days = [
        { day: 'Monday', hours: applicant.sectionC.monday },
        { day: 'Tuesday', hours: applicant.sectionC.tuesday },
        { day: 'Wednesday', hours: applicant.sectionC.wednesday },
        { day: 'Thursday', hours: applicant.sectionC.thursday },
        { day: 'Friday', hours: applicant.sectionC.friday },
        { day: 'Saturday', hours: applicant.sectionC.saturday },
        { day: 'Sunday', hours: applicant.sectionC.sunday },
      ].filter(day => day.hours);
      setDaysOfWeek(days);
    }
  }, [applicant]);

  useEffect(() => {
    if (applicant?.sectionD) {
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

      const allItems = [...step1Items, ...step2Items];
      
      const itemsWithStatus = allItems.map((text, index) => {
        const itemKey = `item${index + 1}`;
        return {
          id: index + 1,
          text,
          checked: applicant.sectionD.checkedItems?.[itemKey] || false
        };
      });

      setDeclarationItems(itemsWithStatus);
    }
  }, [applicant]);

  // Enhanced document fetching for hybrid approach (local storage + Firestore paths)
  useEffect(() => {
    const fetchUploadedDocuments = async () => {
      if (!applicant?.id) {
        console.log('No applicant ID found');
        return;
      }

      setLoadingDocuments(true);
      console.log('🔍 Fetching documents for applicant:', applicant.id);

      try {
        let allDocuments = [];

        // STRATEGY 1: Check localStorage first (documents are saved locally)
        console.log('💾 Checking localStorage for documents...');
        const localDocuments = JSON.parse(localStorage.getItem('localDocuments') || '[]');
        const applicantLocalDocuments = localDocuments
          .filter(doc => doc.applicantId === applicant.id)
          .map(doc => ({
            ...doc,
            source: 'localStorage',
            hasLocalFile: true
          }));
        
        console.log('💾 Found localStorage documents:', applicantLocalDocuments.length);
        console.log('💾 Local documents details:', applicantLocalDocuments);
        
        allDocuments = [...allDocuments, ...applicantLocalDocuments];

        // STRATEGY 2: Check Firestore for document metadata/paths
        try {
          console.log('📋 Checking Firestore for document metadata/paths...');
          const q = query(
            collection(db, 'documents'), 
            where('applicantId', '==', applicant.id),
            orderBy('uploadDate', 'desc')
          );
          
          const querySnapshot = await getDocs(q);
          console.log(`📋 Found ${querySnapshot.size} document records in Firestore`);

          const firestoreDocuments = await Promise.all(
            querySnapshot.docs.map(async (docSnapshot) => {
              const data = docSnapshot.data();
              console.log('📋 Firestore document record:', data);
              
              const documentData = {
                id: docSnapshot.id,
                source: 'firestore-metadata',
                ...data,
                uploadDate: data.uploadDate?.toDate?.() || data.uploadDate || new Date()
              };

              // Check if this Firestore record matches any local document
              const matchingLocalDoc = applicantLocalDocuments.find(localDoc => 
                localDoc.fileName === data.fileName || 
                localDoc.fileSize === data.fileSize
              );

              if (matchingLocalDoc) {
                console.log('✅ Found matching local document for Firestore record:', data.fileName);
                documentData.hasLocalFile = true;
                documentData.localUrl = matchingLocalDoc.localUrl;
              }

              // If we have a storage path but no local file, try to get from Firebase Storage
              if (data.storagePath && !documentData.hasLocalFile) {
                try {
                  console.log('🔄 Attempting to get file from Firebase Storage:', data.storagePath);
                  const storageRef = ref(storage, data.storagePath);
                  const downloadURL = await getDownloadURL(storageRef);
                  documentData.downloadURL = downloadURL;
                  documentData.fromStorage = true;
                  console.log('✅ Successfully got file from Firebase Storage');
                } catch (storageError) {
                  console.warn('❌ Could not get file from Firebase Storage:', storageError);
                  documentData.downloadError = true;
                  documentData.storageError = storageError.message;
                }
              }

              return documentData;
            })
          );

          // Add Firestore documents that don't have local matches
          const uniqueFirestoreDocs = firestoreDocuments.filter(firestoreDoc => 
            !allDocuments.some(existingDoc => 
              existingDoc.fileName === firestoreDoc.fileName &&
              existingDoc.source === 'localStorage'
            )
          );

          allDocuments = [...allDocuments, ...uniqueFirestoreDocs];
          console.log('📋 Added Firestore metadata documents:', uniqueFirestoreDocs.length);

        } catch (firestoreError) {
          console.error('❌ Firestore query error:', firestoreError);
        }

        // STRATEGY 3: Check if documents are embedded in applicant data
        try {
          console.log('📁 Checking applicant document for embedded files...');
          const applicantDoc = await getDoc(doc(db, 'applicants', applicant.id));
          if (applicantDoc.exists()) {
            const applicantData = applicantDoc.data();
            console.log('📁 Applicant data keys:', Object.keys(applicantData));
            
            // Look for document arrays
            const documentFields = ['uploadedDocuments', 'documents', 'files', 'attachments'];
            
            for (const fieldName of documentFields) {
              if (applicantData[fieldName] && Array.isArray(applicantData[fieldName])) {
                console.log(`📁 Found embedded documents in field: ${fieldName}`, applicantData[fieldName]);
                
                const embeddedDocuments = applicantData[fieldName].map((docData, index) => {
                  // Check if this embedded document matches any local file
                  const matchingLocalDoc = applicantLocalDocuments.find(localDoc => 
                    localDoc.fileName === docData.fileName
                  );

                  return {
                    id: `embedded-${applicant.id}-${index}`,
                    source: 'embedded',
                    field: fieldName,
                    ...docData,
                    uploadDate: docData.uploadDate?.toDate?.() || docData.timestamp?.toDate?.() || new Date(),
                    hasLocalFile: !!matchingLocalDoc,
                    localUrl: matchingLocalDoc?.localUrl
                  };
                });
                
                allDocuments = [...allDocuments, ...embeddedDocuments];
                console.log(`✅ Added ${embeddedDocuments.length} embedded documents`);
              }
            }
          }
        } catch (embeddedError) {
          console.error('❌ Error checking embedded documents:', embeddedError);
        }

        console.log('✅ FINAL - Total documents found:', allDocuments.length);
        console.log('✅ FINAL - Document details:', allDocuments);
        
        // Set the documents state
        setUploadedDocuments(allDocuments);
        
      } catch (error) {
        console.error('❌ Final document fetch error:', error);
        // Fallback: only use localStorage documents
        try {
          const localDocuments = JSON.parse(localStorage.getItem('localDocuments') || '[]');
          const applicantLocalDocuments = localDocuments
            .filter(doc => doc.applicantId === applicant.id)
            .map(doc => ({
              ...doc,
              source: 'localStorage',
              hasLocalFile: true
            }));
          setUploadedDocuments(applicantLocalDocuments);
        } catch (finalError) {
          console.error('❌ Ultimate fallback error:', finalError);
          setUploadedDocuments([]);
        }
      } finally {
        setLoadingDocuments(false);
      }
    };

    fetchUploadedDocuments();
  }, [applicant]);

  // Enhanced document preview handler for hybrid approach
  const handleDocumentPreview = async (document) => {
    try {
      console.log('👁️ Previewing document:', document);
      
      // Priority 1: Use local file if available
      if (document.localUrl) {
        console.log('💾 Using local file for preview');
        window.open(document.localUrl, '_blank');
        return;
      }
      
      // Priority 2: Use download URL if available
      if (document.downloadURL) {
        console.log('☁️ Using cloud file for preview');
        window.open(document.downloadURL, '_blank');
        return;
      }
      
      // Priority 3: Try to get from Firebase Storage using storage path
      if (document.storagePath && !document.downloadURL) {
        try {
          console.log('🔄 Getting file from storage path:', document.storagePath);
          const storageRef = ref(storage, document.storagePath);
          const downloadURL = await getDownloadURL(storageRef);
          
          // Update the document with the new URL
          const updatedDocuments = uploadedDocuments.map(doc => 
            doc.id === document.id ? { ...doc, downloadURL } : doc
          );
          setUploadedDocuments(updatedDocuments);
          
          window.open(downloadURL, '_blank');
          return;
        } catch (error) {
          console.error('❌ Error getting file from storage path:', error);
          alert('Failed to get document from storage. The file might not exist at the specified path.');
          return;
        }
      }
      
      alert('Document preview is not available for this file.');
    } catch (error) {
      console.error('❌ Error previewing document:', error);
      alert('Failed to open document. Please try downloading it instead.');
    }
  };

  // Enhanced document download handler for hybrid approach
  const handleDocumentDownload = async (document) => {
    try {
      console.log('⬇️ Downloading document:', document);
      
      // Priority 1: Use local file if available
      if (document.localUrl) {
        console.log('💾 Downloading from local storage');
        const link = document.createElement('a');
        link.href = document.localUrl;
        link.download = document.fileName || 'document';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      
      let downloadUrl = document.downloadURL;
      
      // Priority 2: If no download URL but has storage path, get it
      if (!downloadUrl && document.storagePath) {
        try {
          console.log('🔄 Getting download URL from storage path');
          const storageRef = ref(storage, document.storagePath);
          downloadUrl = await getDownloadURL(storageRef);
          
          // Update the document with the new URL
          const updatedDocuments = uploadedDocuments.map(doc => 
            doc.id === document.id ? { ...doc, downloadURL: downloadUrl } : doc
          );
          setUploadedDocuments(updatedDocuments);
        } catch (error) {
          console.error('❌ Error getting download URL:', error);
          alert('Failed to get document from storage. The file might not exist at the specified path.');
          return;
        }
      }
      
      // Priority 3: Use the download URL
      if (downloadUrl) {
        console.log('☁️ Downloading from cloud storage');
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = document.fileName || 'document';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Download is not available for this file.');
      }
    } catch (error) {
      console.error('❌ Error downloading document:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  const handleProceed = () => {
    localStorage.setItem('applicantDocId', applicant.id);
    navigate('/recommendation-form');
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (fileType) => {
    if (!fileType) return 'other';
    if (fileType.includes('pdf')) return 'pdf';
    if (fileType.includes('image')) return 'image';
    if (fileType.includes('word')) return 'word';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'excel';
    if (fileType.includes('text')) return 'text';
    return 'other';
  };

  const getFileIcon = (fileType) => {
    const type = getFileType(fileType);
    const icons = {
      pdf: '📄',
      image: '🖼️',
      word: '📝',
      excel: '📊',
      text: '📃',
      other: '📁'
    };
    return icons[type] || icons.other;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const sectionNavigation = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'job', label: 'Job Details', icon: '💼' },
    { id: 'work', label: 'Work Hours', icon: '⏱️' },
    { id: 'details', label: 'Work Details', icon: '🏢' },
    { id: 'documents', label: 'Documents', icon: '📎' },
    { id: 'declaration', label: 'Declaration', icon: '📝' },
  ];

  if (!applicant) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="applicant-title">
            <h2>{applicant.sectionA?.firstNames} {applicant.sectionA?.surname}</h2>
            <span className={`status-badge ${applicant.status?.toLowerCase() || 'pending'}`}>
              {applicant.status || 'Pending'}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Section Navigation */}
        <div className="section-navigation">
          {sectionNavigation.map(section => (
            <button
              key={section.id}
              className={`nav-btn ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-label">{section.label}</span>
            </button>
          ))}
        </div>

        <div className="modal-body">
          <div className="applicant-summary">
            <div className="summary-item">
              <span className="summary-label">ID Number</span>
              <span className="summary-value">{applicant.sectionA?.identityNumber || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Personnel #</span>
              <span className="summary-value">{applicant.sectionA?.personnelNumber || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Submitted</span>
              <span className="summary-value">
                {applicant.createdAt?.toDate?.().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) || 'N/A'}
              </span>
            </div>
          </div>

          <div className="details-container">
            {/* Personal Information Section */}
            {(activeSection === 'personal' || !activeSection) && (
              <div className="section">
                <div className="section-header">
                  <h3>Personal Information</h3>
                  <div className="section-icon">👤</div>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <span>{applicant.sectionA?.firstNames} {applicant.sectionA?.surname}</span>
                  </div>
                  <div className="info-item">
                    <label>Email Address</label>
                    <span>{applicant.sectionA?.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone Number</label>
                    <span>{applicant.sectionA?.cellPhone || applicant.sectionA?.officePhone || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Identity Number</label>
                    <span>{applicant.sectionA?.identityNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Job Details Section */}
            {activeSection === 'job' && (
              <div className="section">
                <div className="section-header">
                  <h3>Job Details</h3>
                  <div className="section-icon">💼</div>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Department</label>
                    <span>{applicant.sectionA?.department}</span>
                  </div>
                  <div className="info-item">
                    <label>Branch/Cluster</label>
                    <span>{applicant.sectionA?.branch || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Directorate/Unit</label>
                    <span>{applicant.sectionA?.unit || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Job Title</label>
                    <span>{applicant.sectionA?.jobTitle || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Personnel Number</label>
                    <span>{applicant.sectionA?.personnelNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Working Hours Section */}
            {activeSection === 'work' && applicant.sectionB && (
              <div className="section">
                <div className="section-header">
                  <h3>Working Hours & Remunerative Work</h3>
                  <div className="section-icon">⏱️</div>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Working Hours (per week)</label>
                    <span>{applicant.sectionB?.workingHours || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Standby Hours (per week)</label>
                    <span>{applicant.sectionB?.standbyHours || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Overtime Hours (per month)</label>
                    <span>{applicant.sectionB?.overtimeHours || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Remunerative Work Category</label>
                    <span>{applicant.sectionB?.remunerativeWork || 'N/A'}</span>
                  </div>
                  {applicant.sectionB?.remunerativeWork === "Other" && (
                    <div className="info-item">
                      <label>Other Category</label>
                      <span>{applicant.sectionB?.otherCategory || 'N/A'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Work Details Section */}
            {activeSection === 'details' && applicant.sectionC && (
              <div className="section">
                <div className="section-header">
                  <h3>Work Details</h3>
                  <div className="section-icon">🏢</div>
                </div>
                <div className="info-grid">
                  {daysOfWeek.length > 0 && (
                    <div className="full-width-item">
                      <label>Weekly Work Schedule</label>
                      <div className="hours-table">
                        <div className="hours-header">
                          <span>Day</span>
                          <span>Hours</span>
                        </div>
                        {daysOfWeek.map((day, index) => (
                          <div key={index} className="hours-row">
                            <span>{day.day}</span>
                            <span>{day.hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="info-item">
                    <label>Total Monthly Hours</label>
                    <span>{applicant.sectionC?.totalMonthlyHours || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Work Address</label>
                    <span>{applicant.sectionC?.workAddress || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Business/Organization</label>
                    <span>{applicant.sectionC?.businessName || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Reporting Person</label>
                    <span>{applicant.sectionC?.reportingPerson || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Contact Number</label>
                    <span>{applicant.sectionC?.contactNumber || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Estimated Monthly Income</label>
                    <span>{applicant.sectionC?.estimatedIncome ? `R ${applicant.sectionC.estimatedIncome}` : 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Section */}
            {activeSection === 'documents' && (
              <div className="section">
                <div className="section-header">
                  <h3>Supporting Documents</h3>
                  <div className="section-icon">📎</div>
                  <span className="documents-count">({uploadedDocuments.length})</span>
                </div>
                <div className="info-grid">
                  <div className="full-width-item">
                    <div className="documents-header">
                      <label>Uploaded Files</label>
                      {uploadedDocuments.length > 0 && (
                        <div className="storage-summary">
                          <span className="storage-item">
                            <span className="storage-dot localStorage"></span>
                            Local Files: {uploadedDocuments.filter(doc => doc.hasLocalFile).length}
                          </span>
                          <span className="storage-item">
                            <span className="storage-dot firebase"></span>
                            Cloud Metadata: {uploadedDocuments.filter(doc => doc.source === 'firestore-metadata').length}
                          </span>
                          <span className="storage-item">
                            <span className="storage-dot embedded"></span>
                            Embedded: {uploadedDocuments.filter(doc => doc.source === 'embedded').length}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {loadingDocuments ? (
                      <div className="loading-documents">
                        <div className="loading-spinner"></div>
                        Loading documents...
                        <div className="loading-details">
                          Checking local storage and Firestore metadata...
                        </div>
                      </div>
                    ) : uploadedDocuments.length > 0 ? (
                      <div className="documents-list">
                        {uploadedDocuments.map((doc, index) => (
                          <div 
                            key={doc.id || index} 
                            className="document-item"
                            data-file-type={getFileType(doc.fileType)}
                            data-source={doc.source}
                          >
                            <div className="document-icon">
                              {getFileIcon(doc.fileType)}
                              {doc.hasLocalFile && <span className="local-indicator" title="Available locally">💾</span>}
                            </div>
                            <div className="document-details">
                              <div className="document-name">
                                {doc.fileName}
                                {doc.hasLocalFile && <span className="local-badge">Local</span>}
                              </div>
                              <div className="document-meta">
                                <span className="document-meta-item">
                                  📏 {formatFileSize(doc.fileSize)}
                                </span>
                                <span className="document-meta-item">
                                  🗂️ {doc.fileType || 'Unknown type'}
                                </span>
                                <span className="document-meta-item">
                                  📅 {formatDate(doc.uploadDate)}
                                </span>
                                <span className="document-meta-item">
                                  {doc.source === 'localStorage' ? '💾 Local' : 
                                   doc.source === 'firestore-metadata' ? '📋 Firestore' : 
                                   doc.source === 'embedded' ? '📁 Embedded' : '❓ Unknown'}
                                </span>
                              </div>
                              {doc.storagePath && (
                                <div className="storage-path">
                                  <small>Storage Path: {doc.storagePath}</small>
                                </div>
                              )}
                              {doc.downloadError && (
                                <div className="document-source">
                                  <span className="error-badge">⚠️ Cloud Unavailable</span>
                                  {doc.storageError && (
                                    <small className="error-details">Error: {doc.storageError}</small>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="document-actions">
                              <button 
                                onClick={() => handleDocumentPreview(doc)}
                                className="preview-btn"
                                title="Preview Document"
                                disabled={!doc.hasLocalFile && doc.downloadError}
                              >
                                {doc.hasLocalFile ? '💾 Preview' : '👁️ Preview'}
                              </button>
                              <button 
                                onClick={() => handleDocumentDownload(doc)}
                                className="download-btn"
                                title="Download Document"
                                disabled={!doc.hasLocalFile && doc.downloadError}
                              >
                                {doc.hasLocalFile ? '💾 Download' : '⬇️ Download'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-documents">
                        <div className="no-documents-icon">📁</div>
                        <p>No supporting documents found.</p>
                        <small>
                          This system uses a hybrid approach:
                          <ul>
                            <li>Files are stored locally in your browser</li>
                            <li>File metadata and paths are stored in Firestore</li>
                            <li>If files aren't showing, they may not have been uploaded</li>
                          </ul>
                        </small>
                        <div className="debug-info">
                          <strong>Debug Info:</strong> Check browser console for detailed retrieval logs.
                          <br />
                          <strong>Applicant ID:</strong> {applicant.id}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Declaration Section */}
            {activeSection === 'declaration' && applicant.sectionD && (
              <div className="section">
                <div className="section-header">
                  <h3>Declaration</h3>
                  <div className="section-icon">📝</div>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <span>{applicant.sectionD?.fullName || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Designation</label>
                    <span>{applicant.sectionD?.designation || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Date</label>
                    <span>{applicant.sectionD?.date || 'N/A'}</span>
                  </div>
                  
                  {declarationItems.length > 0 && (
                    <div className="full-width-item">
                      <label>Accepted Terms & Conditions</label>
                      <div className="declaration-items">
                        {declarationItems
                          .filter(item => item.checked)
                          .map(item => (
                            <div key={item.id} className="declaration-item">
                              <span className="declaration-number">{item.id}.</span>
                              <span className="declaration-text">{item.text}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="action-btn evaluate" onClick={handleProceed}>
            <span className="btn-icon">📋</span>
            Proceed to Evaluation
          </button>
          <button className="action-btn close" onClick={onClose}>
            <span className="btn-icon">✕</span>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantModal;