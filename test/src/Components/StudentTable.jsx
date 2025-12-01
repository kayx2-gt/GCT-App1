import React from "react";
import API_URL from "../config";

export default function StudentTable({ students, handleDeleteStudent, toggleStatus }) {
  return (
    <div className="table-wrapper">
      <table className="books-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Photo</th>
            <th>Username</th>
            <th>Password</th>
            <th>Full Name</th>
            <th>Library Card No</th>
            <th>Student No</th>
            <th>Course & Year</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>
                {s.photo ? (
                  <img
                    src={`${API_URL}/uploads/${s.photo}`}
                    alt="Student"
                    className="student-table-photo"
                  />
                ) : (
                  "No photo"
                )}
              </td>

              <td>{s.username}</td>
              <td>{s.password}</td>
              <td>{s.fullname}</td>
              <td>{s.libraryCardNo}</td>
              <td>{s.studentNo}</td>
              <td>{s.courseYear}</td>

              <td className="status-column">
                <button className="btn delete-btn" onClick={() => handleDeleteStudent(s.id)}>
                  ❌ Remove
                </button>

                <button
                  className="btn status-btn"
                  style={{
                    backgroundColor: s.status === "active" ? "green" : "red",
                    color: "white",
                    marginTop: "10px"
                  }}
                  onClick={() => toggleStatus(s.id, s.status)}
                >
                  {s.status === "active" ? "Active" : "Inactive"}
                </button>
              </td>
            </tr>
          ))}

          {students.length === 0 && (
            <tr>
              <td colSpan="9" className="empty-msg">
                No students yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
