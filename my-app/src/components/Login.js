// Login.jsx
import React, { useState } from 'react';
import './Authenication.css';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // ✅ import navigate

const Login = () => {
  const navigate = useNavigate(); // ✅ initialize navigate

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log("User logged in:", userCredential.user);
      alert("Login successful!");
      // ✅ redirect after login
      navigate('/dashboard');  

    } catch (error) {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Background Shapes */}
      <div className="auth-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      {/* Login Form */}
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <p className="auth-subtitle">Welcome back! Please log in to continue.</p>

          <div className="input-group">
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label className="form-label">Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label className="form-label">Password</label>
          </div>

          <button 
            type="submit" 
            className={`auth-button ${loading ? "submitting" : ""}`}
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : "Login"}
          </button>

          <div className="auth-footer">
            Don’t have an account?{" "}
            <span className="auth-link" onClick={() => navigate('/signup')}>
              Sign Up
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
