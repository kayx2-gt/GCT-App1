import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import AdminModal from "../Components/AdminModal"; // adjust path if needed


export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedAdmin = localStorage.getItem("isAdmin");
    if (savedAdmin === "true") {
      setIsAdmin(true);
    } else {
      setIsModalOpen(true); // force login modal if not logged in
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    const savedAdmin = localStorage.getItem("isAdmin");
    if (savedAdmin === "true") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  return (
    <div className="admin-panel">
      {/* Admin Login Modal */}
      <AdminModal isOpen={isModalOpen} closeModal={closeModal} />

      {isAdmin ? (
        <div>
          {/* ✅ Admin Navbar */}
          <nav className="admin-navbar">
            <ul>
              <li>
                <NavLink to="/BookInventory">📚 Book Inventory</NavLink>
              </li>
              <li>
                <NavLink to="/StudentUser">👨‍🎓 Student User</NavLink>
              </li>
            </ul>
            <div id="admin">
              <button onClick={() => setIsModalOpen(true)} className="nav-link-like">
                <img src="/Assets/manager.png" alt="Admin" />
              </button>
            </div>
          </nav>

          <h1>📊 Welcome to Admin Panel</h1>
          <p>Here you can manage books, users, and more.</p>
        </div>
      ) : (
        !isModalOpen && (
          <div>
            <p>Redirecting to login...</p>
          </div>
        )
      )}
    </div>
  );
}
