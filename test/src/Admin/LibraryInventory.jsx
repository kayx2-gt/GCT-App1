import React, { useState, useEffect } from "react";
import '../LibraryInv.css';
import { useNavigate } from "react-router-dom";
import SearchBar from "../Components/SearchBar";
import AdminModal from "../Components/AdminModal";
import API_URL from "../config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
          <form onSubmit={handleAddBook} className="book-form">
            <div className="form-left">
              <div className="form-group">
                <label>Title:</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Author:</label>
                <input type="text" name="author" value={form.author} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea name="description" value={form.description} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label>Publication Date:</label>
                <DatePicker
                  selected={form.pub_date ? new Date(form.pub_date) : null}
                  onChange={(date) => setForm({ ...form, pub_date: date.toISOString().slice(0, 10) })}
                  showMonthDropdown showYearDropdown dropdownMode="select"
                  placeholderText="Published Date"
                />
              </div>
              <div className="form-group">
                <label>Quantity:</label>
                <input
                  className="Quantitybox" type="number" name="quantity" min="0"
                  value={form.quantity} onChange={handleChange} required
                />
              </div>
            </div>

            <div className="form-right">
              <h2 className="dropzone-title">Book Cover</h2>
              <div
                className={`dropzone ${isDragging ? "dragging" : ""}`}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={e => { e.preventDefault(); setIsDragging(false); setPreview(null); document.getElementById("coverInput").value = ""; }}
                onDrop={e => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file && file.type.startsWith("image/")) handleFileSelect(file); }}
                onClick={() => document.getElementById("coverInput").click()}
              >
                {preview ? <img src={preview} alt="Book Cover Preview" /> : <span>📂 Insert Img or Drag Img</span>}
                <input id="coverInput" type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFileSelect(e.target.files[0])} />
              </div>
              <button type="submit" className="btn">Add Book</button>
            </div>
          </form>

          {/* Borrow Requests + History */}
          <div className="borrow-panels">

            <div className="borrow-panel left-panel">
              <h2>📘 Borrow Requests</h2>
              {borrowRequests.length > 0 ? (
                <div class="table-scroll">
                <table className="books-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Book</th>
                      <th>Status</th>
                      <th>Borrow Date</th>
                      <th>Due Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowRequests.map(r => (
                      <tr key={r.id}>
                        <td>{r.student_name}</td>
                        <td>{r.book_title}</td>
                        <td className={`status-${r.status.toLowerCase().replace(" ", "-")}`}>{r.status}</td>
                        <td>{new Date(r.borrow_date).toLocaleString()}</td>
                        <td>{new Date(r.due_date).toLocaleString()}</td>
                        <td>
                          {r.status === "Pending Approval" && <>
                            <button onClick={() => updateBorrowStatus(r.id, "Claimable")}>Approve</button>
                            <button onClick={() => updateBorrowStatus(r.id, "Not Approved")}>Deny</button>
                          </>}
                          {r.status === "Claimable" && <button onClick={() => updateBorrowStatus(r.id, "Borrowed")}>Claimed ✅</button>}
                          {r.status === "Borrowed" && <button onClick={() => handleReturn(r.id, r.book_id)}>Returned 📦</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              ) : <p className="empty-msg">No borrow requests.</p>}
            </div>

            <div className="borrow-panel right-panel">
              <h2>📚 Borrow History</h2>
              {borrowHistory.length > 0 ? (
                <div class="table-scroll">
                <table className="books-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Book</th>
                      <th>Status</th>
                      <th>Borrow Date</th>
                      <th>Returned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowHistory.map(h => (
                      <tr key={h.id}>
                        <td>{h.student_name}</td>
                        <td>{h.book_title}</td>
                        <td className={h.status === "Not Approved" ? "status-denied" : "status-returned"}>
                          {h.status === "Not Approved" ? "❌ Not Approved" : "📗 Returned"}
                        </td>
                        <td>{new Date(h.borrow_date).toLocaleString()}</td>
                        <td>{h.return_date ? new Date(h.return_date).toLocaleString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              ) : <p className="empty-msg">No history yet.</p>}
            </div>
          </div>

          {/* Books Table */}
          <div className="table-wrapper">
            <table className="books-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Publication Date</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Cover</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map(row => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.title}</td>
                    <td>{row.author}</td>
                    <td>{row.publication_date}</td>
                    <td className="tb-description">{row.description}</td>
                    <td>{row.quantity_in_stock}</td>
                    <td>{row.cover_image ? <img src={`${API_URL}/uploads/${row.cover_image}`} alt="Book Cover" className="table-cover" /> : "No cover"}</td>
                    <td className={row.quantity_in_stock > 0 ? "status available" : "status out"}>
                      {row.quantity_in_stock > 0 ? "Available" : "Out of Stock"}
                    </td>
                    <td><button className="btn btn-danger" onClick={() => handleDeleteBook(row.id)}>Remove</button></td>
                  </tr>
                ))}
                {books.length === 0 && <tr><td colSpan="9" className="empty-msg">No books in inventory.</td></tr>}
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
