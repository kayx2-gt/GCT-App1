import React, { useState } from "react";
import "../AboutGct.css";
import Navbar from "../Components/Navbar";
import EnrollFormModal from "../Components/EnrollFormModal";
import InstructorProfile from "../Components/InstructorProfile"; // ⬅️ IMPORT THE NEW COMPONENT
import ContactModal from "../Components/ContactModal";


const AboutUs = () => {
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);


  // NEW: instructor modal state
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  // Instructor data
  const instructors = [
  {
    name: "Andrew",
    role: "Expert in Modern Teaching",
    sex: "Male",
    graduate: "University of the Philippines",
    specialization: "Modern Teaching Techniques, Educational Technology",
    achievements: [
      "Awarded Best Lecturer 2020",
      "Published 5 research papers on modern pedagogy"
    ],
    photo: "/assets/Andrew.jpg", // replace with actual path
    description:
      "Andrew is known for modern teaching practices, innovative classroom techniques, and engaging learning strategies. He specializes in empowering students through creativity and technology.",
  },
  {
    name: "Johnny",
    role: "Academic Operations Specialist",
    sex: "Male",
    graduate: "De La Salle University",
    specialization: "Academic Program Management, Administration",
    achievements: [
      "Managed 10+ academic programs",
      "Recipient of Excellence in Academic Management 2019"
    ],
    photo: "/assets/kalbo.png",
    description:
      "Johnny ensures smooth and effective academic operations. He supervises programs, supports faculty members, and maintains educational quality across departments.",
  },
  {
    name: "Statham",
    role: "Student Career & Academic Guide",
    sex: "Male",
    graduate: "Ateneo de Manila University",
    specialization: "Career Counseling, Academic Advising",
    achievements: [
      "Mentored over 500 students successfully",
      "Certified Career Counselor"
    ],
    photo: "/assets/Jason.webp",
    description:
      "Statham guides students in strategic academic planning and career development. He is known for his helpful mentoring, career support, and inspiring approach to student success.",
  },
];


  return (
    <div className="AboutGct-wrapper">
      <Navbar />
      <div className="about-wrapper">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="overlay"></div>
          <div className="about-hero-content">
            <h1>Garcia College of Technology</h1>
            <p>
              We are committed to delivering world-class education that
               not only inspires creativity, innovation, and excellence
                in every student but also cultivates critical thinking,
                 leadership abilities, and a strong sense of social responsibility,
                  empowering them to achieve both personal growth and professional
                   success in an ever-evolving global landscape.
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
    Our institution has been a foundation of high-quality learning for decades. 
    We combine traditional values with modern teaching methods to ensure every student 
    receives a holistic and meaningful education experience.
  </p>

  <div className="pyramid-wrapper">

    {/* Top row: Vision & Values side by side */}
    <div className="pyramid-row top">
      <div className="pyramid-card vision">
        <h3>Mission</h3>
        <p>
          Garcia College of Technology is committed to provide quality education,
           to develop the full potentialities and capabilities, of the individual.
        </p>
      </div>

      <div className="pyramid-card values">
        <h3>Vision</h3>
        <p>
          Garcia College of Technology envisions to help men and women achieve their dreams
           so that they can contribute to the development of our society.
        </p>
      </div>
    </div>

    {/* Bottom row: Mission centered */}
    <div className="pyramid-row bottom">
      <div className="pyramid-card mission">
        <h3>Goal</h3>
        <p>
          Garcia College of Technology provides effective and efficient Administration in promoting quality
          education and develops the full potentialities and capabilities of the individual for global competitiveness.
        </p>
      </div>
    </div>

  </div>
</section>




        {/* History Section */}
<section className="gct-history-section">
  <div className="gct-history-content">
    <h2 className="gct-history-title">The History of GCT</h2>
    <p className="gct-history-text">
      Garcia College of Technology (GCT) is widely recognized as the premier business
       and engineering school in Kalibo, Aklan. Founded in 1968 by the late Don Florencio
        M. Garcia and Doña Enrica Reyes Garcia, the institution has grown from a small technical school into a respected center for higher learning in the province. Over the years, GCT has continued to enhance its programs to meet the evolving demands of industry and the community. Today, it stands as a trusted institution dedicated to shaping skilled professionals and future leaders.
    </p>

    <button
      className="gct-history-btn"
      onClick={() => (window.location.href = "/History")}
    >
      Know More
    </button>
  </div>

  <div className="gct-history-image">
    <img src="/Assets/Founders.png" alt="GCT History" />
  </div>
</section>



{/* FUTURE READY */}
<section className="future-ready-section">
  <h2 className="section-title2">Be Future-Ready. Be Garcians.</h2>

  <div className="fr-content-wrapper">
    <div className="fr-left">
      <div className="fr-item">
        <img src="/Assets/icons/21st.webp" alt="" className="fr-i" />
        <div>
          <h3>21st Century Education</h3>
          <p>Gain industry-driven knowledge and skills with modules from leading industry partners in Garcia College of Technology.</p>
        </div>
      </div>

      <div className="fr-item">
        <img src="/Assets/icons/Learn.jpg" alt=""  className="fr-i" />
        <div>
          <h3>Learn Anytime, Study Anywhere</h3>
          <p>Flexible blended learning system that adapts to your schedule and lifestyle.</p>
        </div>
      </div>

      <div className="fr-item">
        <img src="/Assets/icons/Facilities.jpg" alt="" className="fr-i" />
        <div>
          <h3>Modern Training Facilities</h3>
          <p>Hands-on experience using updated tools, equipment, and real-world learning laboratories.</p>
        </div>
      </div>

      <div className="fr-item">
        <img src="/Assets/icons/Work.jpg" alt="" className="fr-i" />
        <div>
          <h3>Enrollment to Employment</h3>
          <p>Programs designed to help students secure job opportunities right after graduation.</p>
        </div>
      </div>
    </div>

    <div className="fr-right">
      <img src="/Assets/become.png" alt="Future Ready" />
    </div>
  </div>
</section>

        {/* Team Section */}
<section className="team-section">
  <div className="about-container">
    <h2 className="section-title">Talented Instructors</h2>

    <div className="team-grid">
      {instructors.map((inst, index) => (
        <div
          key={index}
          className="team-card"
          onClick={() => setSelectedInstructor(inst)}
          style={{ cursor: "pointer" }}
        >
          <div
            className="team-photo"
            style={{
              backgroundImage: `url(${inst.photo})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          ></div>
          <h4>{inst.name}</h4>
          <p>{inst.role}</p>
        </div>
      ))}
    </div>
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

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />


      {/* FOOTER */}
      <footer className="footer-b">
  <div className="footer-b-glow"></div>

  <div className="footer-b-container">

    {/* BRAND */}
    <div className="footer-b-brand">
      <img src="/Assets/GCT-Logo3.png" alt="GCT Logo" className="footer-b-logo" />
      <div>
        <h3 className="footer-b-title">Garcia College of Technology</h3>
        <p className="footer-b-tagline">Excellence. Innovation. Discipline.</p>
      </div>
    </div>

    {/* EXPLORE LINKS */}
    <div className="footer-b-block">
      <h4 className="footer-b-heading">Explore</h4>
      <ul>
        <li><a href="/">About GCT</a></li>
        <li><a href="/Courses">Programs</a></li>
        <li><a href="/History">History</a></li>
      </ul>
    </div>

    {/* CONTACT */}
    <div className="footer-b-block">
      <h4 className="footer-b-heading">Contact</h4>
      <p><a href="tel:+6362620624">(036) 262-0624</a></p>
      <p><a href="https://www.gct.edu.ph/">gct.edu.ph</a></p>
    </div>

  </div>

  <div className="footer-b-bottom">
    © {new Date().getFullYear()} Garcia College of Technology — All Rights Reserved
  </div>
</footer>

    </div>
  );
};

export default AboutUs;