import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "../Navbar.css";
import API_URL from "../config";

import ContactModal from "./ContactModal";
import EnrollFormModal from "./EnrollFormModal";
import UserModal from "./UserLogin";
import NavigationSidebar from "./NavigationSidebar";

export default function Navbar() {
  const [isUserModal, setIsUserModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [userImage, setUserImage] = useState("/Assets/manager.png");
  const [studentName, setStudentName] = useState("");
  const [isNavbarDown, setIsNavbarDown] = useState(false); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const startY = useRef(null);

  useEffect(() => {
    const loadUser = () => {
      const student = JSON.parse(localStorage.getItem("student"));

      if (student) {
        // Set user name
        setStudentName(student.fullname || student.username || "");

        // Set user image
        if (student.photo) {
          setUserImage(`${API_URL}/uploads/${student.photo}`);
        } else {
          setUserImage("/Assets/manager.png");
        }
      } else {
        // No user found → fallback
        setStudentName("");
        setUserImage("/Assets/manager.png");
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  useEffect(() => {
  if (window.innerWidth <= 600) {
    if (!isNavbarDown && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }
}, [isNavbarDown, isMenuOpen]);

  const toggleNavbar = () => {
    setIsNavbarDown(!isNavbarDown);
  };

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!e.currentTarget.classList.contains("navbar")) return;

    if (startY.current === null) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 50) setIsNavbarDown(true);
    if (diff < -50) setIsNavbarDown(false);
  };

  const handleTouchEnd = () => {
    startY.current = null;
  };

  return (
    <div className="navbase">
      <div
        className={`navbar ${isNavbarDown ? "navbar-down" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="nav-links">
          <div id="admin">
            <NavigationSidebar 
            isMenuOpen={isMenuOpen} 
            setIsMenuOpen={setIsMenuOpen} 
          />
            <button
              onClick={() => setIsUserModal(true)}
              className="nav-link-like user-button"
            >
              <img src={userImage} alt="User" className="user-avatar" />

              {studentName && (
                <span className="user-name">
                  {studentName}
                </span>
              )}
            </button>
          </div>

          {/* ✅ Optional collapsible menu area */}
          <div className={`home-links ${isMenuOpen ? "show-menu" : ""}`}>
            <div>
              <span
                onClick={() => setIsEnrollOpen(true)}
                className="nav-link-like"
              >
                ENROLL OnL-GO
              </span>
            </div>
            <div>
              <NavLink to="/">ABOUT GCT</NavLink>
            </div>
            <div>
              <NavLink to="/Library">LIBRARY</NavLink>
            </div>
            <div>
              <NavLink to="/Courses">COURSES</NavLink>
            </div>
            <div>
              <span
                onClick={() => setIsModalOpen(true)}
                className="nav-link-like"
              >
                CONTACT US
              </span>
            </div>
          </div>

          <div className="logo">
            <img src="/Assets/GCT-Logo3.png" alt="Logo" />
          </div>
        </div>
      </div>

      <div
        className="arrow-container-navbar"
        style={{
          opacity: isMenuOpen ? 0 : 1,
          pointerEvents: isMenuOpen ? "none" : "auto",
          transition: "opacity 0.3s ease"
        }}
      >

        <button
          className={`down-arrow ${isNavbarDown ? "arrow-up" : ""}`}
          onClick={!isMenuOpen ? toggleNavbar : undefined}
          disabled={isMenuOpen}
          style={{
            pointerEvents: isMenuOpen ? "none" : "auto",
            opacity: isMenuOpen ? 0 : 1
          }}
        >
          ▼
        </button>
      </div>

      <UserModal isOpen={isUserModal} closeModal={() => setIsUserModal(false)} />
      <ContactModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
      <EnrollFormModal isOpen={isEnrollOpen} closeModal={() => setIsEnrollOpen(false)} />
    </div>
  );
}
