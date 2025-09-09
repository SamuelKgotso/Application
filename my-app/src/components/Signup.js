import React, { useState } from 'react';
import './Authenication.css';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const departments = [
  "ICT",
  "FINANCE",
  "HRM",
  "SCM",
  "HIS",
  "THERAPUTIC",
  "CLINIC",
  "EXCUTIVE",
  "NURSING",
];

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    department: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(user, { displayName: formData.username });

      await setDoc(doc(db, "applicant", user.uid), {
        uid: user.uid,
        displayName: formData.username,
        email: formData.email,
        department: formData.department,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });

      console.log("User created and stored:", user.uid);
      navigate("/");

    } catch (error) {
      console.error("Signup error:", error.message);
      alert("Signup failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <div className="auth-form-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join us by filling out the information below</p>
          
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder=" "
              value={formData.username}
              onChange={handleChange}
              required
              className="form-input"
            />
            <label className="form-label">Username</label>
          </div>
          
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
            <label className="form-label">Email</label>
          </div>
          
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
            <label className="form-label">Password</label>
          </div>

          <div className="input-group">
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value=""> </option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <label className="form-label select-label">Department</label>
          </div>
          
          <button 
            type="submit" 
            className={`auth-button ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
          
          <p className="auth-footer">
            Already have an account? <span className="auth-link" onClick={() => navigate('/login')}>Sign In</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;