import React, { useState } from "react";
import "../AboutGct.css";
import Navbar from "../Components/Navbar";
import EnrollFormModal from "../Components/EnrollFormModal";
import InstructorProfile from "../Components/InstructorProfile"; // ⬅️ IMPORT THE NEW COMPONENT

const AboutUs = () => {
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);

  // NEW: instructor modal state
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  // Instructor data
  const instructors = [
  {
    name: "Boogs",
    role: "Expert in Modern Teaching",
    sex: "Male",
    graduate: "University of the Philippines",
    specialization: "Modern Teaching Techniques, Educational Technology",
    achievements: [
      "Awarded Best Lecturer 2020",
      "Published 5 research papers on modern pedagogy"
    ],
    photo: "/images/boogs.jpg", // replace with actual path
    description:
      "Boogs is known for modern teaching practices, innovative classroom techniques, and engaging learning strategies. He specializes in empowering students through creativity and technology.",
  },
  {
    name: "Kalbo",
    role: "Academic Operations Specialist",
    sex: "Male",
    graduate: "De La Salle University",
    specialization: "Academic Program Management, Administration",
    achievements: [
      "Managed 10+ academic programs",
      "Recipient of Excellence in Academic Management 2019"
    ],
    photo: "/images/kalbo.jpg",
    description:
      "Kalbo ensures smooth and effective academic operations. He supervises programs, supports faculty members, and maintains educational quality across departments.",
  },
  {
    name: "Panot",
    role: "Student Career & Academic Guide",
    sex: "Male",
    graduate: "Ateneo de Manila University",
    specialization: "Career Counseling, Academic Advising",
    achievements: [
      "Mentored over 500 students successfully",
      "Certified Career Counselor"
    ],
    photo: "/images/panot.jpg",
    description:
      "Panot guides students in strategic academic planning and career development. He is known for his helpful mentoring, career support, and inspiring approach to student success.",
  },
];


  return (
    <>
      <Navbar />

      <div className="about-wrapper">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="overlay"></div>
          <div className="about-hero-content">
            <h1>Garcia College of Technology</h1>
            <p>
              We are committed to delivering world-class education that inspires
              creativity, innovation, and excellence in every student, guiding
              them toward success.
            </p>

            <button
              className="enroll-button"
              onClick={() => setIsEnrollOpen(true)}
            >
              Enroll Now
            </button>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="about-info container">
          <h2 className="section-title">Who We Are</h2>
          <p className="about-description">
            Our institution has been a foundation of high-quality learning for
            decades. We combine traditional values with modern teaching methods
            to ensure every student receives a holistic and meaningful education
            experience.
          </p>

          <div className="info-grid">
            <div className="info-card">
              <h3>🎓 Our Mission</h3>
              <p>
                To nurture students with knowledge, skills, and values that
                empower them to excel academically and socially.
              </p>
            </div>

            <div className="info-card">
              <h3>🌟 Our Vision</h3>
              <p>
                To become a leading center of academic excellence where students
                thrive and become future leaders.
              </p>
            </div>

            <div className="info-card">
              <h3>💡 Our Values</h3>
              <p>
                Integrity, respect, creativity, discipline, and a passion for
                lifelong learning.
              </p>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="about-history container">
          <h2 className="section-title">Our History</h2>
          <p className="about-description">
            Our school has evolved over decades, nurturing generations of
            learners with quality education.
          </p>

          <div className="history-grid">
            <div className="history-card">
              <span className="history-year">1960</span>
              <h4>Founded</h4>
              <p>
                Started as a small community school with a vision for quality
                education.
              </p>
            </div>

            <div className="history-card">
              <span className="history-year">1980</span>
              <h4>Expansion</h4>
              <p>
                Added new facilities, programs, and extracurricular
                opportunities.
              </p>
            </div>

            <div className="history-card">
              <span className="history-year">2000</span>
              <h4>Modernization</h4>
              <p>
                Introduced digital classrooms and innovative teaching methods.
              </p>
            </div>

            <div className="history-card">
              <span className="history-year">Today</span>
              <h4>Excellence</h4>
              <p>
                Recognized as a leading institution, fostering global learners.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="choose-us-section">
          <div className="container">
            <h2 className="section-title light">Why Choose Us</h2>
            <div className="choose-grid">
              <div className="choose-card">
                <span className="icon">🏅</span>
                <h4>Skilled Lecturers</h4>
                <p>Our educators bring passion and expertise to every classroom.</p>
              </div>

              <div className="choose-card">
                <span className="icon">📚</span>
                <h4>Modern Library</h4>
                <p>
                  Thousands of books, journals, and digital resources available.
                </p>
              </div>

              <div className="choose-card">
                <span className="icon">💼</span>
                <h4>Career Support</h4>
                <p>
                  We prepare students for real-world success and opportunities.
                </p>
              </div>

              <div className="choose-card">
                <span className="icon">🎓</span>
                <h4>Scholarship Programs</h4>
                <p>Financial aid for outstanding and deserving students.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section container">
          <h2 className="section-title">Talented Instructors</h2>

          <div className="team-grid">
            {instructors.map((inst, index) => (
              <div
                key={index}
                className="team-card"
                onClick={() => setSelectedInstructor(inst)} // ⬅️ OPEN MODAL WHEN CLICKED
                style={{ cursor: "pointer" }}
              >
                <div className="team-photo"></div>
                <h4>{inst.name}</h4>
                <p>{inst.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Instructor Modal */}
      <InstructorProfile
        instructor={selectedInstructor}
        onClose={() => setSelectedInstructor(null)}
      />

      {/* Enroll Form Modal */}
      <EnrollFormModal
        isOpen={isEnrollOpen}
        closeModal={() => setIsEnrollOpen(false)}
      />
    </>
  );
};

export default AboutUs;
