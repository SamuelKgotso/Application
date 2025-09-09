import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Departments from "./components/Departments"; // you'll create this
import Users from "./components/Users"; // you'll create this

import Ethics from "./components/Ethics"; 
import EthicsForm from "./components/EthicsForm";// shared for Supervisor, Ethics, HOD
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            
            <Route path="/departments" element={<Departments />} />
            <Route path="/users" element={<Users />} /> {/* ✅ */}
            <Route path="/ethic" element={<Ethics />} />
            <Route path="/ethicform" element={<EthicsForm />} />
           
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
