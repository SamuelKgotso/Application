import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { getDocs, collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import './Usermanagement.css';

// Define departments to match the Signup component
const departmentsList = [
  "ICT",
  "FINANCE",
  "HRM",
  "SCM",
  "HIS",
  "THERAPUTIC",
  "CLINIC",
  "EXCUTIVE",
  "NURSING",
];

const Usermanagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    displayName: '',
    role: '',
    status: '',
    department: ''
  });

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'applicant');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      displayName: user.displayName || '',
      role: user.role || '',
      status: user.status || 'pending',
      department: user.department || ''
    });
  };

  // Save edited user
  const handleSave = async () => {
    if (!editingUser) return;
    try {
      const userRef = doc(db, 'applicant', editingUser.id);
      await updateDoc(userRef, editForm);
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...editForm } : user
      ));
      setEditingUser(null);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const userRef = doc(db, 'applicant', userId);
      await deleteDoc(userRef);
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  // Unique roles, departments, statuses for filters
  const roles = [...new Set(users.map(user => user.role).filter(Boolean))];
  const statuses = ['active', 'suspended', 'pending'];

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  if (loading) {
    return (
      <div className="user-management-loading">
        <div className="spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      {/* Header */}
      <div className="user-management-header">
        <h1>User Management</h1>
        <p>Manage all registered users and their permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon total"></div>
          <div className="stat-info">
            <h3>{users.filter(u => u.email).length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active"></div>
          <div className="stat-info">
            <h3>{users.filter(u => u.email && u.status === 'active').length}</h3>
            <p>Active Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon admin"></div>
          <div className="stat-info">
            <h3>{users.filter(u => u.email && u.role === 'admin').length}</h3>
            <p>Administrators</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending"></div>
          <div className="stat-info">
            <h3>{users.filter(u => u.email && u.status === 'pending').length}</h3>
            <p>Pending Users</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="filter-group">
          <label>Role:</label>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            {roles.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {statuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Department:</label>
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
            <option value="all">All Departments</option>
            {departmentsList.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.displayName ? user.displayName.charAt(0) : user.email?.charAt(0)}
                    </div>
                    <div className="user-details">
                      <strong>{user.displayName || 'No Name'}</strong>
                      <span>ID: {user.id.substring(0, 8)}</span>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-tag ${user.role || 'no-role'}`}>
                    {user.role || 'No role'}
                  </span>
                </td>
                <td>{user.department || '-'}</td>
                <td>
                  <span className={`status-tag ${user.status || 'pending'}`}>
                    {user.status || 'pending'}
                  </span>
                </td>
                <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(user)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="no-users">
                  No users found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="close-btn" onClick={() => setEditingUser(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={editForm.displayName}
                  onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Administrator</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="applicant">Applicant</option>
                  <option value="reviewer">Reviewer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="form-group">
                <label>Department</label>
                <select
                  value={editForm.department}
                  onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                >
                  <option value="">Select Department</option>
                  {departmentsList.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setEditingUser(null)}>Cancel</button>
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usermanagement;
