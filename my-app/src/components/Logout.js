// Logout.jsx
import React, { useEffect } from 'react';
import './Authenication.css';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await signOut(auth);
        alert('Logged out successfully');
        navigate('/login'); // ⬅ Redirects to login after logout
      } catch (error) {
        alert('Logout failed: ' + error.message);
      }
    };

    doLogout();
  }, [navigate]);

  
};

export default Logout;
