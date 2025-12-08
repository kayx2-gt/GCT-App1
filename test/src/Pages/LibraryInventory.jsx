import React, { useState, useEffect } from "react";
import "../LibraryInv.css";
import { useNavigate } from "react-router-dom";

import SearchBar from "../Components/SearchBar";
import AdminModal from "../Components/AdminLogin";
import API_URL from "../config";
import BorrowRequests from "../Components/BorrowRequests";
import BorrowHistory from "../Components/BorrowHistory";
import AddBookForm from "../Components/AddBookForm";
import BookTable from "../Components/BookTable";

export default function BookInventory() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [borrowRequests, setBorrowRequests] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);

  const [form, setForm] = useState({
    title: "",
    author: "",
    pub_date: "",
    description: "",
    quantity: 1,
    cover: null,
  });

  // CHECK ADMIN LOGIN
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
    setIsAdmin(savedAdmin === "true");
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    setForm((prev) => ({ ...prev, cover: file }));
    setPreview(URL.createObjectURL(file));
  };

  // FETCH DATA ONCE WHEN ADMIN LOGS IN
  useEffect(() => {
    if (!isAdmin) return;
    fetchBooks();
    fetchAllBorrowData();
  }, [isAdmin]);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/books`);
      const data = await res.json();
      if (Array.isArray(data)) setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const fetchAllBorrowData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/borrow/all`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setBorrowRequests(
          data.filter((r) =>
            ["Pending Approval", "Approved", "Claimable", "Borrowed", "Received"].includes(r.status)
          )
        );

        setBorrowHistory(
          data.filter((r) =>
            ["Returned", "Not Approved"].includes(r.status)
          )
        );
      }
    } catch (err) {
      console.error("Error loading borrow data:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "cover" && files?.[0]) {
      handleFileSelect(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();

    if (!form.cover) return alert("Please upload a book cover!");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("author", form.author);
    formData.append("publication_date", form.pub_date);
    formData.append("description", form.description);
    formData.append("quantity", form.quantity);
    formData.append("cover", form.cover);

    try {
      const res = await fetch(`${API_URL}/api/books`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Book added successfully!");
        setBooks((prev) => [data, ...prev]);

        setForm({
          title: "",
          author: "",
          pub_date: "",
          description: "",
          quantity: 1,
          cover: null,
        });

        setPreview(null);
      } else {
        alert(data.error || "Failed to add book.");
      }
    } catch (err) {
      console.error("Add Book Error:", err);
      alert("Server error while adding book.");
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      await fetch(`${API_URL}/api/books/${id}`, { method: "DELETE" });
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const updateBorrowStatus = async (recordId, newStatus) => {
    let reason = "";

    if (newStatus === "Not Approved") {
      reason = prompt("Enter reason for denial:");
      if (!reason) return;
    }

    try {
      const res = await fetch(`${API_URL}/api/borrow/update-status/${recordId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reason }),
      });

      const data = await res.json();

      if (data.success) {
        if (newStatus === "Not Approved") {
          setBorrowRequests((prev) => prev.filter((r) => r.id !== recordId));
          setBorrowHistory((prev) => [...prev, { ...data.updatedRecord, status: "Not Approved", reason }]);
        } else {
          setBorrowRequests((prev) =>
            prev.map((r) =>
              r.id === recordId ? { ...r, status: newStatus } : r
            )
          );
        }
      } else {
        alert("❌ Failed to update status.");
      }
    } catch (err) {
      console.error("Status Error:", err);
      alert("Server error.");
    }
  };

  const handleReturn = async (recordId, bookId) => {
    if (!window.confirm("Confirm book return?")) return;

    try {
      const res = await fetch(`${API_URL}/api/borrow/return/${recordId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      const data = await res.json();

      if (data.success) {
        setBorrowRequests((prev) => prev.filter((r) => r.id !== recordId));
        setBorrowHistory((prev) => [...prev, { ...data.updatedRecord, status: "Returned" }]);
      }
    } catch (err) {
      console.error("Return Error:", err);
    }
  };

  return (
    <div className="libraryInv-body">
      <button
        className="admin-switch-btn"
        onClick={() => navigate("/StudentUser")}
      >
        Go to Student Accounts
      </button>

      <AdminModal isOpen={isModalOpen} closeModal={closeModal} />

      {isAdmin ? (
        <>
          <div className="libheader">
            <h1>Book Inventory Management</h1>
            <img src="/Assets/GCT-Logo3.png" alt="Logo" />
          </div>

          <SearchBar />

          <AddBookForm
            form={form}
            preview={preview}
            isDragging={isDragging}
            handleChange={handleChange}
            handleFileSelect={handleFileSelect}
            handleAddBook={handleAddBook}
            setForm={setForm}
            setIsDragging={setIsDragging}
          />

          <div className="borrow-panels">
            <BorrowRequests
              borrowRequests={borrowRequests}
              updateBorrowStatus={updateBorrowStatus}
              handleReturn={handleReturn}
            />

            <BorrowHistory borrowHistory={borrowHistory} />
          </div>

          <div className="table-wrapper">
            <BookTable
              books={books}
              handleDeleteBook={handleDeleteBook}
            />
          </div>
        </>
      ) : (
        !isModalOpen && <p>⏳ Redirecting to login...</p>
      )}
    </div>
  );
}
