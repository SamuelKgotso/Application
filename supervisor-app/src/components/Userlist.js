import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './Userlist.css';

const Userlist = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('displayName');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setUsers(usersData);
        setFilteredUsers(usersData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users: " + err.message);
        setLoading(false);
        console.error("Firestore error:", err);
      }
    };

    fetchUsers();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let result = users;
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(user => 
        (user.displayName && user.displayName.toLowerCase().includes(lowerSearchTerm)) ||
        (user.email && user.email.toLowerCase().includes(lowerSearchTerm)) ||
        (user.id && user.id.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      
      // Handle date fields differently
      if (sortField === 'createdAt' || sortField === 'lastLogin') {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredUsers(result);
  }, [users, searchTerm, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUsers(usersData);
      setLoading(false);
    } catch (err) {
      setError("Failed to refresh users: " + err.message);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="user-list-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="user-list-container">
      <div className="error-message">
        <p>Error: {error}</p>
        <button onClick={refreshUsers} className="retry-button">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>Registered Users</h2>
        <div className="controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <button onClick={refreshUsers} className="refresh-button">
            Refresh
          </button>
        </div>
      </div>

      <div className="user-count">
        {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
      </div>

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th 
                className={sortField === 'displayName' ? 'active' : ''}
                onClick={() => handleSort('displayName')}
              >
                Name {sortField === 'displayName' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={sortField === 'email' ? 'active' : ''}
                onClick={() => handleSort('email')}
              >
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>User ID</th>
              <th 
                className={sortField === 'createdAt' ? 'active' : ''}
                onClick={() => handleSort('createdAt')}
              >
                Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={sortField === 'lastLogin' ? 'active' : ''}
                onClick={() => handleSort('lastLogin')}
              >
                Last Login {sortField === 'lastLogin' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="avatar">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="name">{user.displayName || 'No name provided'}</div>
                    </div>
                  </td>
                  <td>{user.email || 'N/A'}</td>
                  <td className="uid">{user.id}</td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-users">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Userlist;