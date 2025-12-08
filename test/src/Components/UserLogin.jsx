import React, { useState, useEffect } from "react";
import API_URL from "../config";
import "../Library.css";

export default function UserModal({ isOpen, closeModal }) {
  const [isUser, setIsUser] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("isUser");
    const savedStudent = localStorage.getItem("student");
    if (savedUser === "true" && savedStudent) {
      setIsUser(true);
      setStudent(JSON.parse(savedStudent));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (res.status === 403) setError("Your account is inactive.");
      else if (data.success) {
        setIsUser(true);
        setStudent(data.student);
        localStorage.setItem("isUser", "true");
        localStorage.setItem("student", JSON.stringify(data.student));
        closeModal();
        window.location.reload();
      } else setError("Invalid credentials");
    } catch (err) {
      setError("Server error");
      console.error(err);
    }
  };

  const handleLogout = () => {
    setIsUser(false);
    setStudent(null);
    localStorage.removeItem("isUser");
    localStorage.removeItem("student");
    closeModal();
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div
      className="login-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div className="login-modal" role="dialog" aria-modal="true">
        <button className="closeUser" onClick={closeModal} aria-label="Close">
          ✕
        </button>

        <div className="inner-frame">
          <img className="logo" src="Assets/GCT-Logo3.png" alt="GCT Logo" />
          <h2 className="title">{isUser ? "User Account" : "User Login"}</h2>

          {error && <div className="error-text">{error}</div>}

          {isUser ? (
            <div className="account-row">
              <div className="status-pill" role="status" aria-live="polite">
                <span className="check">✓</span>
                <div className="status-text">
                  <div className="small">You are logged in as</div>
                  <div className="name">{student?.fullname || student?.username || "User"}</div>
                </div>
              </div>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
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
              <button className="login-submit" type="submit">
                Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}