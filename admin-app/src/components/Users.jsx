import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where, doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./Users.css";

const Users = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("You must be signed in to view applicants.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 🔹 Get the user's role
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        setRole(userData.role || "user");

        // 🔹 Build query
        let q;
        if (userData.role === "admin") {
          // Admin sees all applicants
          q = query(collection(db, "applicant"), orderBy("surname", "asc"));
        } else {
          // Normal user sees only their own applicant doc
          q = query(
            collection(db, "applicant"),
            where("userId", "==", user.uid)
          );
        }

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setApplicants(data);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setError(`Failed to fetch applicants: ${err.message}`);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const departments = ["All", ...new Set(applicants.map((a) => a.department))];

  const filteredApplicants =
    selectedDepartment === "All"
      ? applicants
      : applicants.filter((a) => a.department === selectedDepartment);

  return (
    <div className="users-container">
      <h2 className="users-title">
        {role === "admin" ? "All Applicants" : "My Application"}
      </h2>

      {role === "admin" && (
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
      )}

      {loading ? (
        <p className="loading-text">Loading applicants...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : filteredApplicants.length > 0 ? (
        <table className="users-list">
          <thead>
            <tr>
              <th>Surname</th>
              <th>First Names</th>
              <th>Department</th>
              <th>Persal Number</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map((applicant) => (
              <tr key={applicant.id}>
                <td>{applicant.surname}</td>
                <td>{applicant.firstNames}</td>
                <td>{applicant.department}</td>
                <td>{applicant.personnelNumber}</td>
                <td>{applicant.email}</td>
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
