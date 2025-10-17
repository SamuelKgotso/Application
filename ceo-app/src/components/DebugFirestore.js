// components/DocumentDebugger.js
import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

const DocumentFirestore = ({ applicantId }) => {
  const [firestoreData, setFirestoreData] = useState(null);
  const [storageData, setStorageData] = useState(null);
  const [localStorageData, setLocalStorageData] = useState(null);
  const [loading, setLoading] = useState(false);

  const debugAllStorage = async () => {
    if (!applicantId) return;
    
    setLoading(true);
    console.log('=== DEBUGGING DOCUMENT STORAGE ===');
    console.log('Applicant ID:', applicantId);

    try {
      // 1. Check Firestore documents collection
      const documentsSnapshot = await getDocs(collection(db, 'documents'));
      const allFirestoreDocs = documentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const applicantFirestoreDocs = allFirestoreDocs.filter(doc => 
        doc.applicantId === applicantId
      );

      console.log('All Firestore documents:', allFirestoreDocs);
      console.log('Applicant Firestore documents:', applicantFirestoreDocs);

      // 2. Check if applicant document has embedded files
      const applicantDoc = await getDoc(doc(db, 'applicants', applicantId));
      const applicantData = applicantDoc.exists() ? applicantDoc.data() : null;
      
      console.log('Applicant data:', applicantData);

      // 3. Check Firebase Storage
      let storageFiles = [];
      try {
        const storageRef = ref(storage, 'documents/');
        const result = await listAll(storageRef);
        
        storageFiles = await Promise.all(
          result.items.map(async (item) => {
            try {
              const url = await getDownloadURL(item);
              return {
                name: item.name,
                fullPath: item.fullPath,
                downloadURL: url
              };
            } catch (error) {
              return {
                name: item.name,
                fullPath: item.fullPath,
                error: error.message
              };
            }
          })
        );
        
        console.log('Storage files:', storageFiles);
      } catch (storageError) {
        console.log('Storage error:', storageError);
      }

      // 4. Check localStorage
      const localDocs = JSON.parse(localStorage.getItem('localDocuments') || '[]');
      const applicantLocalDocs = localDocs.filter(doc => doc.applicantId === applicantId);
      
      console.log('LocalStorage documents:', applicantLocalDocs);

      setFirestoreData({
        allDocuments: allFirestoreDocs,
        applicantDocuments: applicantFirestoreDocs,
        applicantData: applicantData
      });
      
      setStorageData(storageFiles);
      setLocalStorageData(applicantLocalDocs);

    } catch (error) {
      console.error('Debug error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicantId) {
      debugAllStorage();
    }
  }, [applicantId]);

  if (loading) {
    return <div>Loading debug information...</div>;
  }

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f8f9fa', 
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <h3>Document Storage Debugger</h3>
      <button onClick={debugAllStorage} style={{ marginBottom: '15px' }}>
        Refresh Debug Info
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
        {/* Firestore Data */}
        <div>
          <h4>Firestore Documents</h4>
          {firestoreData ? (
            <>
              <p><strong>Total Documents:</strong> {firestoreData.allDocuments.length}</p>
              <p><strong>Applicant Documents:</strong> {firestoreData.applicantDocuments.length}</p>
              {firestoreData.applicantDocuments.map(doc => (
                <div key={doc.id} style={{ 
                  background: 'white', 
                  padding: '8px', 
                  margin: '5px 0',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}>
                  <div><strong>ID:</strong> {doc.id}</div>
                  <div><strong>File:</strong> {doc.fileName}</div>
                  <div><strong>Type:</strong> {doc.fileType}</div>
                  <div><strong>Path:</strong> {doc.storagePath}</div>
                </div>
              ))}
            </>
          ) : (
            <p>No Firestore data</p>
          )}
        </div>

        {/* Storage Data */}
        <div>
          <h4>Storage Files</h4>
          {storageData ? (
            <>
              <p><strong>Total Files:</strong> {storageData.length}</p>
              {storageData.map((file, index) => (
                <div key={index} style={{ 
                  background: 'white', 
                  padding: '8px', 
                  margin: '5px 0',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}>
                  <div><strong>Name:</strong> {file.name}</div>
                  <div><strong>Path:</strong> {file.fullPath}</div>
                  {file.error && <div style={{ color: 'red' }}>Error: {file.error}</div>}
                </div>
              ))}
            </>
          ) : (
            <p>No storage data</p>
          )}
        </div>

        {/* LocalStorage Data */}
        <div>
          <h4>LocalStorage Documents</h4>
          {localStorageData ? (
            <>
              <p><strong>Total Documents:</strong> {localStorageData.length}</p>
              {localStorageData.map((doc, index) => (
                <div key={index} style={{ 
                  background: 'white', 
                  padding: '8px', 
                  margin: '5px 0',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}>
                  <div><strong>File:</strong> {doc.fileName}</div>
                  <div><strong>Type:</strong> {doc.fileType}</div>
                  <div><strong>Size:</strong> {doc.fileSize} bytes</div>
                </div>
              ))}
            </>
          ) : (
            <p>No localStorage data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentFirestore;