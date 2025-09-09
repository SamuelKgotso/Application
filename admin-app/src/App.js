import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

 // you'll create this
import Users from "./components/Users"; // you'll create this
import RolePage from "./components/RolePage";
import SupervisorPanel from "./components/SupervisorPanel";
import Dashboard from "./components/Dashboard"; 
import Usermanagement from "./components/Usermanagement";  // shared for Supervisor, Ethics, HOD
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            
            <Route path="/management" element={<Usermanagement />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/users" element={<Users />} /> {/* ✅ */}
            <Route path="/supervisor" element={<SupervisorPanel />} />
            <Route path="/role/:roleName" element={<RolePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
