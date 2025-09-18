// components/Login.js
import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('supervisor');
  const [department, setDepartment] = useState('HR');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple authentication (in a real app, this would call an API)
    if (username && password) {
      // For demo purposes, any password works
      const userData = {
        username,
        role,
        department: role === 'supervisor' ? department : null
      };
      login(userData);
    } else {
      setError('Please enter both username and password');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Dashboard Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="ceo">CEO</option>
            <option value="ethic">Ethic</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </div>
        
        {role === 'supervisor' && (
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="IT">IT</option>
              <option value="Hrm">HRM</option>
              <option value="Scm">SCM</option>
              <option value="His">HIS</option>
              <option value="Theraputic">THERAPUTIC</option>
              <option value="Clinic">CLINIC</option>
              <option value="Excutive">EXCUTIVE</option>
              <option value="Nursing">NURSING</option>
            </select>
          </div>
        )}
        
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;