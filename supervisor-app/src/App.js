import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Departments from "./components/Departments"; // you'll create this
import Users from "./components/Users"; // you'll create this
import Userlist from "./components/Userlist"; 
import SupervisorPanel from "./components/SupervisorPanel";
import RecommendationForm from "./components/RecommendationForm"; // shared for Supervisor, Ethics, HOD
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
            <Route path="/supervisor" element={<SupervisorPanel />} />
            <Route path="/recomm" element={<RecommendationForm/>} />
            <Route path="/userlist" element={<Userlist/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
