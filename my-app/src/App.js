import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Shared components
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ApplicantForm from './components/ApplicantForm';
import DetailsForm from './components/DetailsForm';
import WorkForm from './components/WorkForm';
import About from './components/About';
import RemunerativeDetailsForm from "./components/RemunerativeDetailsForm";
import DeclarationForm from "./components/DeclarationForm";
import RecommendationForm from "./components/RecommendationForm";
import SectionGForm from "./components/SectionGForm";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";
import DepartmentSelection from "./components/DepartmentSelection";
import ApplicantDash from "./components/ApplicantDash";

// Section components
import SectionA from "./components/SectionA";
import SectionB from "./components/SectionB";
import SectionC from "./components/SectionC";
import SectionD from "./components/SectionD";
import SectionF from "./components/SectionF";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          {/* Landing page */}
          <Route path="/" element={<HeroSection />} />

          {/* Applicant Dashboard Steps */}
          <Route path="/appform/step1" element={<Dashboard />} />
          <Route path="/appform/step2" element={<ApplicantDash currentSection="A" />} />
          <Route path="/appform/section-b" element={<ApplicantDash currentSection="B" />} />
          <Route path="/appform/section-c" element={<ApplicantDash currentSection="C" />} />
          <Route path="/appform/section-d" element={<ApplicantDash currentSection="D" />} />
          {/* Section F handled by separate component */}
          <Route path="/appform/section-f" element={<SectionF />} />
          <Route path="/appform/step3" element={<DepartmentSelection />} />

          {/* Section forms */}
          <Route path="/appform/section-a" element={<SectionA />} />
          <Route path="/appform/section-b" element={<SectionB />} />
          <Route path="/appform/section-c" element={<SectionC />} />
          <Route path="/appform/section-d" element={<SectionD />} />

          {/* Other forms */}
          <Route path="/applicant-form" element={<ApplicantForm />} />
          <Route path="/detail-form" element={<DetailsForm />} />
          <Route path="/work-form" element={<WorkForm />} />
          <Route path="/about-form" element={<About />} />
          <Route path="/remune-form" element={<RemunerativeDetailsForm />} />
          <Route path="/declare-form" element={<DeclarationForm />} />
          <Route path="/recomm-form" element={<RecommendationForm />} />
          <Route path="/section-form" element={<SectionGForm />} />

          {/* Authentication routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;