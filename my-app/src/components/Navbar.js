import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { auth } from "./firebase"; // Adjust the path if necessary
import { onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">RWOPS</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about-form">About</Link></li>

        {currentUser && (
          <li
            className="dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
            onClick={toggleDropdown}
          >
            <span className="dropdown-title">AppForm ▼</span>
            {dropdownOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/appform/step1">Profile</Link></li>
                <br />
                <li><Link to="/appform/step2">App Form</Link></li>
                <br />
                <li><Link to="/appform/step3">Departments</Link></li>
              </ul>
            )}
          </li>
        )}

        {!currentUser && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}

        {currentUser && (
          <li><Link to="/logout">Logout</Link></li>
        )}
      </ul>
    </nav>
  );
}
