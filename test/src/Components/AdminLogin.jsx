import React, { useState, useEffect } from "react";
import API_URL from "../config";
import "../Library.css";

export default function AdminModal({ isOpen, closeModal }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("isAdmin");
    if (saved === "true") setIsAdmin(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdmin(true);
        localStorage.setItem("isAdmin", "true");
        closeModal();
        if (data.admin) localStorage.setItem("admin", JSON.stringify(data.admin));
        alert("✅ Logged in as Admin!");
        window.location.reload();
      } else {
        setError(data.error || "❌ Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Server error.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("admin");
    closeModal();
    window.location.reload();
  };

  const saveNewPassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: credentials.username || "admin", newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("✅ Password changed successfully!");
        setIsChangePasswordOpen(false);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert("❌ " + (data.error || "Failed to change password"));
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-overlay" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="login-modal" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
        <button className="closeUser" onClick={closeModal} aria-label="Close">×</button>

        <div className="inner-frame">
          <div className="header">
            <img className="logo" src="Assets/GCT-Logo3.png" alt="GCT Logo" />
            <h2 id="admin-login-title" className="title">{isAdmin ? "Admin Account" : "Admin Login"}</h2>
          </div>

          {error && !isAdmin && <div className="error-text">{error}</div>}

          {isAdmin ? (
            <div className="account-row">
              <div className="status-pill" role="status" aria-live="polite">
                <span className="check">✓</span>
                <div className="status-text">
                  <div className="small">You are logged in as</div>
                  <div className="name">Admin</div>
                </div>
              </div>

              <div className="action-group">
                <button
                  className="change-btn"
                  onClick={() => setIsChangePasswordOpen(true)}
                >
                  Change Password
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <form className="login-form" onSubmit={handleLogin}>
              <input
                className="login-input"
                type="text"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
                autoFocus
              />
              <input
                className="login-input"
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
              <button className="login-submit" type="submit">Login</button>
            </form>
          )}

          {isChangePasswordOpen && (
            <div className="change-overlay" onMouseDown={(e) => e.target === e.currentTarget && setIsChangePasswordOpen(false)}>
              <div className="change-modal">
                <button className="closeUser" onClick={() => setIsChangePasswordOpen(false)} aria-label="Close">×</button>
                <h3>Change Password</h3>
                <input
                  className="login-input"
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  className="login-input"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button className="login-submit" onClick={saveNewPassword}>Save</button>
                  <button className="logout-btn" onClick={() => setIsChangePasswordOpen(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}