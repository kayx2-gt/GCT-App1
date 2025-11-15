import React, { useState, useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import "../LibraryInv.css";
import AdminModal from "../Components/AdminModal";
import API_URL from "../config";
import StudentSearchBar from "../Components/StudentSearchbar";


export default function StudentUser() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    fullname: "",
    libraryCardNo: "",
    studentNo: "",
    courseYear: "",
    photo: null, 
  });

  // ✅ check admin on mount
  useEffect(() => {
    const savedAdmin = localStorage.getItem("isAdmin");
    if (savedAdmin === "true") {
      setIsAdmin(true);
    } else {
      setIsModalOpen(true);
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    const savedAdmin = localStorage.getItem("isAdmin");
    if (savedAdmin === "true") setIsAdmin(true);
  };

  const handleFileSelect = (file) => {
    if (file) {
      setForm({ ...form, photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteStudent = async (id) => {
  if (!window.confirm("Are you sure you want to delete this student?")) return;

  try {
    const res = await fetch(`${API_URL}/api/students/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (res.ok && data.success) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert(data.error || "❌ Failed to delete student");
    }
  } catch (err) {
    console.error("Error deleting student:", err);
  }
};

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files[0]) {
      handleFileSelect(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchStudents = async () => {
    const res = await fetch(`${API_URL}/api/students`);
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    if (isAdmin) fetchStudents();
  }, [isAdmin]);

  const handleAddStudent = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const res = await fetch(`${API_URL}/api/students/add`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        alert("✅ Student added!");
        setStudents((prev) => [data, ...prev]);
        await fetchStudents();
        setForm({
          username: "",
          password: "",
          fullname: "",
          libraryCardNo: "",
          studentNo: "",
          courseYear: "",
          photo: null,
        });
        setPreview(null);
      } else {
        alert(data.error || "❌ Failed to add student");
      }
    } catch (err) {
      console.error("Error adding student:", err);
    }
  };

  // Toggle active/inactive
const toggleStatus = async (id, currentStatus) => {
  try {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const res = await fetch(`${API_URL}/api/students/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });

    if (res.ok) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: newStatus } : s
        )
      );
    }
  } catch (err) {
    console.error("Error updating status:", err);
  }
};

  return (
    <div className="libraryInv-body">
      <button className="admin-switch-btn"onClick={() => navigate("/BookInventory")}>Go to Book Inventory</button>
      <AdminModal isOpen={isModalOpen} closeModal={closeModal} />

      {isAdmin ? (
        <>
          <div className="libheader">
            <h1>Student Accounts</h1>
            <img src="/Assets/GCT-Logo3.png" alt="Logo"/>
          </div>
          <StudentSearchBar />
          <form onSubmit={handleAddStudent} className="book-form">
            {/* Left side - inputs */}
            <div className="form-left">
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Library Card No:</label>
                <input
                  type="text"
                  name="libraryCardNo"
                  value={form.libraryCardNo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Student No:</label>
                <input
                  type="text"
                  name="studentNo"
                  value={form.studentNo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Course & Year:</label>
                <input
                  type="text"
                  name="courseYear"
                  value={form.courseYear}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Right side - student photo */}
            <div className="form-right">
              <h2 className="dropzone-title">Student Photo (1x1)</h2>
              <div
                className={`dropzone2 ${isDragging ? "dragging" : ""}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    setPreview(null); // 🔹 remove preview
                    setForm((prev) => ({ ...prev, profilePic: null })); // 🔹 clear form value
                    document.getElementById("profileInput").value = ""; // 🔹 reset input
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith("image/")) {
                    handleFileSelect(file);
                    }
                }}
                onClick={() => document.getElementById("profileInput").click()}
                >
                {preview ? (
                    <img src={preview} alt="Profile Preview" className="profile-preview" />
                ) : (
                    <span>📂 Insert Profile Pic or Drag Img</span>
                )}
                <input
                    id="profileInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                />
                </div>
              <button type="submit" className="btn">
                ➕ Add Student
              </button>
            </div>
          </form>

          {/* Students Table */}
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
                <th>Actions</th> {/* 🔹 new column */}
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
                    <button
                        className="btn delete-btn"
                        onClick={() => handleDeleteStudent(s.id)}
                    >
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
        </>
      ) : (
        !isModalOpen && <p>⏳ Redirecting to login...</p>
      )}
    </div>
  );
}
