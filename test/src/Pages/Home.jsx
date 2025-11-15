import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";


export default function Home() {
  return (
    <div>
      <Navbar />
      {/* Cards Section */}
      <div className="cards-wrapper">
        <section className="gct-cards">
          <div className="card">
            <h3>ENROLL OnL-GO</h3>
            <p>
              Experience a fast, convenient, and fully digital enrollment system designed
              to save you time. With just a few clicks, you can register for classes,
              upload your requirements, and secure your slot at Garcia College of
              Technology without leaving home. Our online portal ensures a smooth process
              that keeps you connected anytime, anywhere.
            </p>
            <Link to={"/Enrollment"} className="btn">Enroll Now</Link>
          </div>

          <div className="card">
            <h3>ABOUT GCT</h3>
            <p>
              Garcia College of Technology has been a trusted institution for generations,
              committed to providing high-quality education and shaping future leaders.
              Guided by its mission and vision, GCT continues to uphold excellence,
              discipline, and innovation. Learn more about our history, core values, and
              the supportive community that drives us forward.
            </p>
            <Link to={"/AboutGct"} className="btn">View</Link>
          </div>

          <div className="card">
            <h3>COURSES OFFERED</h3>
            <p>
              GCT offers a wide range of programs across Information Technology,
              Engineering, Business, Hospitality, and more. Each course is designed to
              provide strong theoretical knowledge balanced with hands-on training. With
              modern facilities and experienced instructors, students gain the skills they
              need to thrive in today’s competitive industries.
            </p>
            <Link to={"/Courses"} className="btn">View Courses</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

