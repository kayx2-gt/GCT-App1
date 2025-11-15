import React, { useState, useEffect } from "react";
import API_URL from "../config";

export default function AdminModal({ isOpen, closeModal }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const savedAdmin = localStorage.getItem("isAdmin");
    if (savedAdmin === "true") setIsAdmin(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (data.success) {
        setIsAdmin(true);
        localStorage.setItem("isAdmin", "true");
        closeModal();
        alert("✅ Logged in as Admin!");
      } else {
        setError("❌ Invalid credentials");
      }
    } catch (err) {
      setError("Server error.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <span className="closeAdmin" onClick={closeModal}>
          &times;
        </span>
        <div className="modal-header">
          <img src="Assets/GCT-Logo3.png" alt="GCT Logo" />
          <h2>{isAdmin ? "Admin Account" : "Admin Login"}</h2>
        </div>

        {error && !isAdmin && <p className="error-text">{error}</p>}

        {isAdmin ? (
          <>
            <p className="admin-status">You are logged in as <strong>Admin</strong> ✅</p>
            <button onClick={() => setIsChangePasswordOpen(true)}>Change Password</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
            <button type="submit">Login</button>
          </form>
        )}

        {isChangePasswordOpen && (
          <div className="login-overlay">
            <div className="login-modal">
              <span onClick={() => setIsChangePasswordOpen(false)}>&times;</span>
              <h2>Change Password</h2>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={async () => {
                  if (!newPassword || newPassword !== confirmPassword) {
                    alert("Passwords do not match!");
                    return;
                  }
                  try {
                    const res = await fetch(`${API_URL}/api/admin/change-password`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ username: "admin", newPassword }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      alert("✅ Password changed successfully!");
                      setIsChangePasswordOpen(false);
                    } else {
                      alert("❌ " + data.error);
                    }
                  } catch {
                    alert("Server error.");
                  }
                }}
              >
                Save Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
