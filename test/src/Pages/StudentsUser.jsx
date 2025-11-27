import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../LibraryInv.css";
import AdminModal from "../Components/AdminLogin";
import API_URL from "../config";
import StudentSearchBar from "../Components/StudentSearchbar";

import StudentTable from "../Components/StudentTable";
import AddStudentForm from "../Components/AddStudentForm";

export default function StudentUser() {
  const [students, setStudents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
    fullname: "",
    libraryCardNo: "",
    studentNo: "",
    courseYear: "",
    photo: null,
  });

  // Check admin
  useEffect(() => {
    const savedAdmin = localStorage.getItem("isAdmin");
    if (savedAdmin === "true") setIsAdmin(true);
    else setIsModalOpen(true);
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    if (localStorage.getItem("isAdmin") === "true") setIsAdmin(true);
  };

  const fetchStudents = async () => {
    const res = await fetch(`${API_URL}/api/students`);
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    if (isAdmin) fetchStudents();
  }, [isAdmin]);

  const handleFileSelect = (file) => {
    if (file) {
      setForm({ ...form, photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Delete student?")) return;

    const res = await fetch(`${API_URL}/api/students/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok && data.success) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files?.[0]) handleFileSelect(files[0]);
    else setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

    if (!form.photo) return alert("❌ Please upload a student photo before submitting.");

    let autoLibrary =
      form.libraryCardNo || (students.length ? Math.max(...students.map((s) => Number(s.libraryCardNo))) + 1 : 15301);

    let autoStudentNo =
      form.studentNo || (students.length ? Math.max(...students.map((s) => Number(s.studentNo))) + 1 : 15201);

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    formData.append("libraryCardNo", autoLibrary);
    formData.append("studentNo", autoStudentNo);

    const res = await fetch(`${API_URL}/api/students/add`, { method: "POST", body: formData });
    await res.json();

    if (res.ok) {
      alert("Student added!");
      fetchStudents();
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
    }
  };

  const toggleStatus = async (id, currentStatus) => {
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
    }
  };

  return (
    <div className="libraryInv-body">
      <button className="admin-switch-btn" onClick={() => navigate("/BookInventory")}>
        Go to Book Inventory
      </button>

      <AdminModal isOpen={isModalOpen} closeModal={closeModal} />

      {isAdmin && (
        <>
          <div className="libheader">
            <h1>Student Accounts</h1>
            <img src="/Assets/GCT-Logo3.png" alt="Logo" />
          </div>

          <StudentSearchBar />

          <AddStudentForm
            form={form}
            preview={preview}
            isDragging={isDragging}
            handleChange={handleChange}
            handleAddStudent={handleAddStudent}
            handleFileSelect={handleFileSelect}
            setIsDragging={setIsDragging}
          />

          <StudentTable
            students={students}
            handleDeleteStudent={handleDeleteStudent}
            toggleStatus={toggleStatus}
          />
        </>
      )}
    </div>
  );
}
