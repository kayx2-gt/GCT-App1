import React, { useEffect, useState } from "react";
import API_URL from "../config";
import ExportEnrollment from "./ExportEnrollment";

export default function EnrollmentHistory() {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("student"));
    if (stored?.id) {
      fetchEnrollments(stored.id);
    }
  }, []);

  const paymentModeText = {
    "1": "Cash",
    "2": "Card",
    "3": "Gcash",
  };

  const paymentTypeText = {
    "1": "Fully Paid",
    "2": "Installment",
  };

  const fetchEnrollments = async (studentId) => {
    try {
      const res = await fetch(`${API_URL}/api/enrollments`);
      const data = await res.json();

      // 🔹 Filter enrollments by logged-in student_id
      const userEnrollments = data.filter((e) => e.student_id === studentId);
      setEnrollments(userEnrollments);
    } catch (err) {
      console.error("Error loading enrollments:", err);
    }
  };

  return (
    <div className="eh-container">
      <h2 className="eh-title">Enrollment History</h2>

      <div className="eh-card-container">
      {enrollments.length === 0 ? (
        <p className="eh-empty">No enrollment records found.</p>
      ) : (
        enrollments.map((enrollment) => (
          
          <div key={enrollment.id} className="eh-card">

            <h3 className="eh-id">ID: {enrollment.id}</h3>

            <div className="eh-row">
              <p>
                <strong>Full Name:</strong> <br />{enrollment.lastName},{" "}
                {enrollment.firstName} {enrollment.middleName}
              </p>
            </div>

            <div className="eh-row">
              <p><strong>Course:</strong> <br />{enrollment.course}</p>
              <p><strong>Year Level:</strong> {enrollment.yearLevel}</p>
              <p><strong>Semester:</strong> {enrollment.semester}</p>
            </div>

            <div className="eh-row">
              <p><strong>DOB:</strong> {enrollment.dob}</p>
              <p><strong>Sex:</strong> {enrollment.sex}</p>
            </div>

            <div className="eh-row">
              <p><strong>Email:</strong> <br />{enrollment.email}</p>
            </div>

            <div className="eh-row">
                <p>
                  <strong>Payment Mode:</strong>{" "}
                  {paymentModeText[enrollment.paymentMode] || enrollment.paymentMode}
                </p>
                <p>
                  <strong>Payment Type:</strong>{" "}
                  {paymentTypeText[enrollment.paymentType] || enrollment.paymentType}
                </p>
                <p>
                  <strong>Amount:</strong> {enrollment.amount}
                </p>
              </div>

            <ExportEnrollment enrollment={enrollment} className= "eh-export-btn" />
          </div>
        ))
      )}
      </div>
    </div>
  );
}
