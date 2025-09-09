import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "./Users.css"; // ✅ Import the CSS file

const Users = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "applicant"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApplicants(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const departments = ["All", ...new Set(applicants.map((a) => a.department))];

  const filteredApplicants =
    selectedDepartment === "All"
      ? applicants
      : applicants.filter((a) => a.department === selectedDepartment);

  return (
    <div className="users-container">
      <h2 className="users-title">All Applicants</h2>

      <div className="users-filter">
        <label htmlFor="department-filter">Filter by Department:</label>
        <select
          id="department-filter"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          {departments.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="loading-text">Loading applicants...</p>
      ) : filteredApplicants.length > 0 ? (
        <table className="users-list">
          <thead>
            <tr>
              <th>Surname</th>
              <th>First Names</th>
              <th>Department</th>
              <th>Job Title</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map((applicant) => (
              <tr key={applicant.id}>
                <td>{applicant.surname}</td>
                <td>{applicant.firstNames}</td>
                <td>{applicant.department}</td>
                <td>{applicant.jobTitle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data">No applicants found.</p>
      )}
    </div>
  );
};

export default Users;
