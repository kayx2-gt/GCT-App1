import React, { useState, useEffect, useRef } from "react";
import "../SearchBar.css";
import API_URL from "../config";
import StudentBorrowHistory from "../Components/StudentBorrowHistory";


export default function StudentSearchBar() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("fullname");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [previewStudent, setPreviewStudent] = useState(null);
  const [showHistory, setShowHistory] = useState(false);


  const wrapperRef = useRef();

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`${API_URL}/api/students/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStudents((prev) => prev.filter((s) => s.id !== id));

        // 🔥 close modal if the deleted student is the one in preview
        if (previewStudent?.id === id) {
          setPreviewStudent(null);
        }
      } else {
        alert(data.error || "❌ Failed to delete student");
      }
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      const res = await fetch(`${API_URL}/api/students/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStudents((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );

        // 🔥 also update the previewStudent if it’s the same student
        if (previewStudent?.id === id) {
          setPreviewStudent((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Load students from backend
  useEffect(() => {
    fetch(`${API_URL}/api/students`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setFilteredStudents([]);
      })
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  // Filter students whenever query changes
  useEffect(() => {
    if (!query) {
      setFilteredStudents([]);
      return;
    }

    let results = students.filter((student) => {
      if (filter === "id") return student.libraryCardNo.toString().includes(query);
      if (filter === "username") return student.username.toLowerCase().includes(query.toLowerCase());
      if (filter === "fullname") return student.fullname.toLowerCase().includes(query.toLowerCase());
      return false;
    });

    if (filter === "fullname") {
      results = results.sort((a, b) => a.fullname.localeCompare(b.fullname));
    }

    setFilteredStudents(results);
  }, [query, filter, students]);

  // Close dropdown if clicking outside wrapper
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="searchbar-wrapper" ref={wrapperRef}>
      <div className="search-controls">
        <h2>Search Students</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="fullname">Full Name</option>
          <option value="username">Username</option>
          <option value="id">Library ID</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${filter}...`}
          value={query}
          onFocus={() => setIsActive(true)}
          onChange={(e) => setQuery(e.target.value)}
        />

        {isActive && filteredStudents.length > 0 && (
          <div className="search-results-cards">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="search-card"
                onClick={() => setPreviewStudent(student)} // open preview when clicked
              >
                <img
                  src={
                    student.photo
                      ? `${API_URL}/uploads/${student.photo}`
                      : "https://via.placeholder.com/100x100?text=No+Photo"
                  }
                  alt={student.fullname}
                  className="card-studentphoto"
                />
                <div className="card-info">
                  <p className="card-fullname">{student.fullname}</p>
                  <p className="card-author">Username: {student.username}</p>
                  <p className="card-id">Library No.: {student.libraryCardNo}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        {previewStudent && (
          <div className="preview-overlay" onClick={() => setPreviewStudent(null)}>
            <div className="preview-card" onClick={(e) => e.stopPropagation()}>
              <img
                src={
                  previewStudent.photo
                    ? `${API_URL}/uploads/${previewStudent.photo}`
                    : "https://via.placeholder.com/200x200?text=No+Photo"
                }
                alt={previewStudent.fullname}
                className="preview-studentphoto"
              />
              <div className="preview-info">
                <p><strong>Name: </strong>{previewStudent.fullname}</p>
                <p><strong>Username: </strong> {previewStudent.username}</p>
                <p><strong>Password: </strong> {previewStudent.password}</p>
                <p><strong>Library ID: </strong> {previewStudent.libraryCardNo}</p>
                <p><strong>Status: </strong> {previewStudent.status}</p>
              </div>

              <div className="status-column">
              <button
                className="btn delete-btn"
                onClick={() => handleDeleteStudent(previewStudent.id)}
              >
                ❌ Remove
              </button>

              <button
                className="btn status-btn"
                style={{
                  backgroundColor:
                    previewStudent.status === "active" ? "green" : "red",
                  color: "white",
                  marginTop: "10px",
                }}
                onClick={() =>
                  toggleStatus(previewStudent.id, previewStudent.status)
                }
              >
                {previewStudent.status === "active" ? "Active" : "Inactive"}
              </button>

              <button
                className="btn view-history-btn"
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  marginTop: "10px",
                }}
                onClick={() => setShowHistory(true)}
              >
                📖 View Borrow History
              </button>
            </div>
            </div>
          </div>
        )}
        {showHistory && previewStudent && (
          <div className="preview-overlay" onClick={() => setShowHistory(false)}>
            <div
              className="preview-card"
              onClick={(e) => e.stopPropagation()}
              style={{ width: "80%", maxHeight: "80vh", overflowY: "auto" }}
            >
              <h2>{previewStudent.fullname} — Borrow History</h2>
              <StudentBorrowHistory studentId={previewStudent.id} />
              <button
                className="btn close-btn"
                style={{ marginTop: "1rem", backgroundColor: "red", color: "white" }}
                onClick={() => {
                  setPreviewStudent(previewStudent);
                  setShowHistory(true);
                  setIsActive(false);
                }}
              >
                ✖ Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
