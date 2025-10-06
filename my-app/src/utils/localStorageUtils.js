// utils/localStorageUtils.js
export const LocalStorageUtils = {
  // Save document to local storage
  saveDocument: (fileInfo) => {
    const documents = JSON.parse(localStorage.getItem('localDocuments') || '[]');
    documents.push({
      ...fileInfo,
      id: Math.random().toString(36).substr(2, 9),
      savedAt: new Date().toISOString()
    });
    localStorage.setItem('localDocuments', JSON.stringify(documents));
    return fileInfo.id;
  },

  // Get all documents from local storage
  getDocuments: () => {
    return JSON.parse(localStorage.getItem('localDocuments') || '[]');
  },

  // Get document by ID
  getDocument: (id) => {
    const documents = JSON.parse(localStorage.getItem('localDocuments') || '[]');
    return documents.find(doc => doc.id === id);
  },

  // Delete document from local storage
  deleteDocument: (id) => {
    const documents = JSON.parse(localStorage.getItem('localDocuments') || '[]');
    const filtered = documents.filter(doc => doc.id !== id);
    localStorage.setItem('localDocuments', JSON.stringify(filtered));
    return filtered;
  },

  // Clear all documents
  clearAll: () => {
    localStorage.removeItem('localDocuments');
  },

  // Get storage usage
  getStorageUsage: () => {
    const documents = JSON.parse(localStorage.getItem('localDocuments') || '[]');
    const totalSize = documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
    return {
      fileCount: documents.length,
      totalSize,
      formattedSize: formatFileSize(totalSize)
    };
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};