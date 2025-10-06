const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const cors = require('cors');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com'
});

const db = admin.firestore();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Endpoint to handle file upload
app.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // The file has been saved to the 'uploads' directory
    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Save the file path to Firestore
    const docRef = db.collection('documents').doc();
    await docRef.set({
      fileName: fileName,
      filePath: filePath,
      uploadDate: new Date()
    });

    res.status(200).json({
      message: 'File uploaded and path saved to Firebase!',
      filePath: filePath,
      fileName: fileName
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});