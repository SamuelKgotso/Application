import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Using your provided Firebase config
import { collection, getDocs } from 'firebase/firestore';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    recommendations: { '5.1': 0, '5.2': 0, '5.3': 0 }
  });
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'applicant'));
        const apps = [];
        const newStats = {
          total: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
          recommendations: { '5.1': 0, '5.2': 0, '5.3': 0 }
        };
        
        querySnapshot.forEach(doc => {
          const data = doc.data();
          apps.push({ id: doc.id, ...data });
          
          // Update stats
          newStats.total++;
          if (data.status === 'approved') newStats.approved++;
          if (data.status === 'pending') newStats.pending++;
          if (data.status === 'rejected') newStats.rejected++;
          
          if (data.supervisorRecommendation) {
            const rec = data.supervisorRecommendation;
            if (rec === '5.1' || rec === '5.2' || rec === '5.3') {
              newStats.recommendations[rec]++;
            }
          }
        });
        
        // Sort by date (newest first)
        apps.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setApplications(apps);
        setStats(newStats);
        setRecentApplications(apps.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applications: ", error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  // Helper functions for charts
  const calculateBarHeight = (value, max) => {
    const maxHeight = 150;
    return (value / max) * maxHeight;
  };

  const getPercentage = (value) => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>RWOPS Application Dashboard</h1>
        <div className="dashboard-summary">
          <div className="summary-card total">
            <h3>Total Applications</h3>
            <p>{stats.total}</p>
          </div>
          <div className="summary-card approved">
            <h3>Approved</h3>
            <p>{stats.approved}</p>
            <span>{getPercentage(stats.approved)}%</span>
          </div>
          <div className="summary-card pending">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
            <span>{getPercentage(stats.pending)}%</span>
          </div>
          <div className="summary-card rejected">
            <h3>Rejected</h3>
            <p>{stats.rejected}</p>
            <span>{getPercentage(stats.rejected)}%</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-row">
          <div className="chart-container">
            <h2>Application Status Distribution</h2>
            <div className="bar-chart">
              <div className="bar-wrapper">
                <div className="bar-label">Approved</div>
                <div className="bar">
                  <div 
                    className="bar-fill approved" 
                    style={{ height: `${calculateBarHeight(stats.approved, stats.total)}px` }}
                  ></div>
                </div>
                <div className="bar-value">{stats.approved}</div>
              </div>
              <div className="bar-wrapper">
                <div className="bar-label">Pending</div>
                <div className="bar">
                  <div 
                    className="bar-fill pending" 
                    style={{ height: `${calculateBarHeight(stats.pending, stats.total)}px` }}
                  ></div>
                </div>
                <div className="bar-value">{stats.pending}</div>
              </div>
              <div className="bar-wrapper">
                <div className="bar-label">Rejected</div>
                <div className="bar">
                  <div 
                    className="bar-fill rejected" 
                    style={{ height: `${calculateBarHeight(stats.rejected, stats.total)}px` }}
                  ></div>
                </div>
                <div className="bar-value">{stats.rejected}</div>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <h2>Recommendation Types</h2>
            <div className="pie-chart-container">
              <div className="pie-chart">
                <div 
                  className="pie-slice slice-1" 
                  style={{ 
                    '--percentage': getPercentage(stats.recommendations['5.1']),
                    '--color': '#4CAF50'
                  }}
                ></div>
                <div 
                  className="pie-slice slice-2" 
                  style={{ 
                    '--percentage': getPercentage(stats.recommendations['5.2']),
                    '--color': '#FFC107',
                    '--offset': getPercentage(stats.recommendations['5.1'])
                  }}
                ></div>
                <div 
                  className="pie-slice slice-3" 
                  style={{ 
                    '--percentage': getPercentage(stats.recommendations['5.3']),
                    '--color': '#F44336',
                    '--offset': getPercentage(stats.recommendations['5.1'] + stats.recommendations['5.2'])
                  }}
                ></div>
                <div className="pie-center">
                  <div className="pie-total">{stats.total}</div>
                  <div className="pie-label">Total</div>
                </div>
              </div>
              <div className="pie-legend">
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
                  <div className="legend-text">5.1 Recommendation</div>
                  <div className="legend-value">{stats.recommendations['5.1']}</div>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#FFC107' }}></div>
                  <div className="legend-text">5.2 With Conditions</div>
                  <div className="legend-value">{stats.recommendations['5.2']}</div>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#F44336' }}></div>
                  <div className="legend-text">5.3 Not Recommended</div>
                  <div className="legend-value">{stats.recommendations['5.3']}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-container full-width">
            <h2>Recent Applications</h2>
            <div className="recent-applications">
              {recentApplications.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Supervisor</th>
                      <th>Recommendation</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map(app => (
                      <tr key={app.id}>
                        <td>{app.applicantName || 'N/A'}</td>
                        <td>{app.supervisorName || 'N/A'}</td>
                        <td>
                          <span className={`rec-tag rec-${app.supervisorRecommendation || 'none'}`}>
                            {app.supervisorRecommendation || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-tag status-${app.status || 'pending'}`}>
                            {app.status || 'pending'}
                          </span>
                        </td>
                        <td>{app.timestamp ? new Date(app.timestamp).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No recent applications found.</p>
              )}
            </div>
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-container full-width">
            <h2>Application Timeline</h2>
            <div className="timeline-chart">
              {applications.slice(0, 10).map((app, index) => (
                <div className="timeline-item" key={app.id}>
                  <div className="timeline-marker">
                    <div className="marker-dot"></div>
                    {index === 0 && <div className="marker-label">Latest</div>}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="applicant-name">{app.applicantName || 'Unknown Applicant'}</span>
                      <span className={`status-tag status-${app.status || 'pending'}`}>
                        {app.status || 'pending'}
                      </span>
                      <span className="timeline-date">
                        {app.timestamp ? new Date(app.timestamp).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="timeline-details">
                      <div>Supervisor: {app.supervisorName || 'N/A'}</div>
                      <div>Recommendation: 
                        <span className={`rec-tag rec-${app.supervisorRecommendation || 'none'}`}>
                          {app.supervisorRecommendation || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;