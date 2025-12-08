import React from "react";
import "../AboutGct.css";

export default function InstructorProfile({ instructor, onClose }) {
  if (!instructor) return null;

  return (
    <div className="about-form-container show animate-fade-in">
      <div className="profile-modal animate-scale-in">
        {/* Close Button */}
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>

        {/* Profile Image */}
        <div className="profile-photo-wrapper">
          <img
            src={instructor.photo}
            alt={instructor.name}
            className="profile-photo"
          />
        </div>

        {/* Name & Role */}
        <h1 className="profile-name">{instructor.name}</h1>
        <p className="profile-role">{instructor.role}</p>

        {/* Profile Details */}
        <div className="profile-details">
          <div className="detail-item">
            <strong>Sex:</strong> <span>{instructor.sex}</span>
          </div>

          <div className="detail-item">
            <strong>Graduate Of:</strong> <span>{instructor.graduate}</span>
          </div>

          <div className="detail-item">
            <strong>Specialization:</strong> <span>{instructor.specialization}</span>
          </div>

          <div className="detail-item achievements">
            <strong>Achievements:</strong>
            {(instructor.achievements || []).length > 0 ? (
              <ul>
                {instructor.achievements.map((ach, i) => (
                  <li key={i}>{ach}</li>
                ))}
              </ul>
            ) : (
              <p>No achievements listed.</p>
            )}
          </div>

          <div className="detail-item about">
            <strong>About:</strong>
            <p>{instructor.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
