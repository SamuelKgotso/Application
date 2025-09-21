// components/Dashboard.js
import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import AdminView from './AdminView';
import CEOView from './CEOView';
import EthicView from './EthicView';
import SupervisorView from './SupervisorView';
import RecommendationForm from './RecommendationForm';
import Sidebar from './Sidebar';
import Header from './Header';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const renderContent = () => {
    switch (user.role) {
      case 'admin':
        return <AdminView />;
      case 'ceo':
        return <CEOView />;
      case 'ethic':
        return <EthicView />;
      case 'supervisor':
        return (
          <Routes>
            <Route path="/" element={<SupervisorView department={user.department} />} />
            <Route path="/recommendation-form" element={<RecommendationForm />} />
          </Routes>
        );
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;