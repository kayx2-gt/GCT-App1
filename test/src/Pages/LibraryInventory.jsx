import React, { useState, useEffect } from "react";
import '../LibraryInv.css';
import { useNavigate } from "react-router-dom";
import SearchBar from "../Components/SearchBar";
import AdminModal from "../Components/AdminLogin";
import API_URL from "../config";
import "react-datepicker/dist/react-datepicker.css";
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
    if (file) {
      setForm({ ...form, cover: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (isAdmin) { 
      fetchBooks();
      fetchAllBorrowData();
    }
  }, [isAdmin]);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/books`);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const fetchAllBorrowData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/borrow/all`);
      const data = await res.json();

      if (Array.isArray(data)) {
        // Active requests
        setBorrowRequests(
          data.filter(r =>
            ["Pending Approval", "Approved", "Claimable", "Borrowed", "Received"]
              .includes(r.status)
          )
        );

        // Completed / denied history
        setBorrowHistory(
          data.filter(r =>
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
    if (name === "cover" && files[0]) {
      handleFileSelect(files[0]);
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
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
      const res = await fetch(`${API_URL}/api/books`, { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        alert("Book added!");
        setBooks(prev => [data, ...prev]);
        setForm({ title: "", author: "", pub_date: "", description: "", quantity: 1, cover: null });
        setPreview(null);
      } else {
        alert(data.error || "Failed to add book");
      }
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await fetch(`${API_URL}/api/books/${id}`, { method: "DELETE" });
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  // ✅ Admin actions for borrow requests
  const updateBorrowStatus = async (recordId, newStatus) => {
    let reason = "";

    if (newStatus === "Not Approved") {
      const reasons = [
        "Book is not available at the moment",
        "Student has reached borrowing limit",
        "Book is reserved for another student",
      ];

      let message = "Select a reason for not approving:\n";
      reasons.forEach((r, i) => { message += `${i+1}. ${r}\n`; });
      message += "Enter number (1–3) or type your own reason:";

      const input = prompt(message);
      if (input === null) return;

      const index = parseInt(input) - 1;
      reason = reasons[index] || input.trim();
      if (!reason) return alert("⚠️ Please provide a reason before denying.");
    }

    try {
      const res = await fetch(`${API_URL}/api/borrow/update-status/${recordId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reason }),
      });
      const data = await res.json();
      if (data.success) {
        alert(
          newStatus === "Not Approved"
            ? `❌ Request denied.\nReason: ${reason}`
            : `✅ Status updated to "${newStatus}"`
        );

        if (newStatus === "Not Approved") {
          setBorrowRequests(prev => prev.filter(r => r.id !== recordId));
          setBorrowHistory(prev => [...prev, { ...data.updatedRecord, status: "Not Approved", reason }]);
        } else {
          setBorrowRequests(prev => prev.map(r => r.id === recordId ? { ...r, status: newStatus } : r));
        }
      } else {
        alert("❌ Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating borrow status:", err);
      alert("⚠️ Server error updating status.");
    }
  };

  const handleReturn = async (recordId, bookId) => {
    if (!window.confirm("Are you sure this book has been returned?")) return;

    try {
      const res = await fetch(`${API_URL}/api/borrow/return/${recordId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Book successfully returned!");
        setBorrowRequests(prev => prev.filter(r => r.id !== recordId));
        setBorrowHistory(prev => [...prev, { ...data.updatedRecord, status: "Returned" }]);
      } else {
        alert("⚠️ Failed to return book: " + data.message);
      }
    } catch (err) {
      console.error("Error returning book:", err);
      alert("⚠️ Something went wrong while returning the book.");
    }
  };

  return (
    <div className="libraryInv-body">
      <button className="admin-switch-btn" onClick={() => navigate("/StudentUser")}>Go to Student Accounts</button>
      <AdminModal isOpen={isModalOpen} closeModal={closeModal} />

      {isAdmin ? (
        <>
          <div className="libheader">
            <h1>Book Inventory Management</h1>
            <img src="/Assets/GCT-Logo3.png" alt="Logo"/>
          </div>
          <SearchBar />

          {/* Add Book Form */}
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

            <BorrowHistory
              borrowHistory={borrowHistory}
            />
          </div>
          {/* Books Table */}
          <div className="table-wrapper">
            <BookTable books={books} handleDeleteBook={handleDeleteBook} />
          </div>
        </>
      ) : (
        !isModalOpen && <p>⏳ Redirecting to login...</p>
      )}
    </div>
  );
}
