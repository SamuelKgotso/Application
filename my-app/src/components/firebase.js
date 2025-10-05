import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCz5DQB0kQ-Nq0dZTuDlmJwcHjDjd8n5kI",
  authDomain: "rwops-f2a24.firebaseapp.com",
  projectId: "rwops-f2a24",
  storageBucket: "rwops-f2a24.appspot.com",
  messagingSenderId: "976355407705",
  appId: "1:976355407705:web:e5f0ff8dcfea77e24b3e48",
  measurementId: "G-BCJL59JY73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const functions = getFunctions(app);
const storage = getStorage(app);

// Export all necessary instances including storage
export { auth, db, functions, storage, app };