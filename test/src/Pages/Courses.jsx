import { useState } from "react";
import Navbar from "../Components/Navbar";
import tuitionFees from "../Data/TuitionFees";
import "../Courses.css";

export default function Courses() {
  const courseNames = Object.keys(tuitionFees);

  // 👇 One hook for ALL courses (store each course’s active year)
  const [activeYear, setActiveYear] = useState(
    Object.fromEntries(courseNames.map((name) => [name, 1]))
  );

  const nextYear = (name) => {
    setActiveYear((prev) => {
      const maxYear = Object.keys(tuitionFees[name].firstSemester).length;
      const newYear = prev[name] >= maxYear ? 1 : prev[name] + 1;
      return { ...prev, [name]: newYear };
    });
  };

  const prevYear = (name) => {
    setActiveYear((prev) => {
      const maxYear = Object.keys(tuitionFees[name].firstSemester).length;
      const newYear = prev[name] <= 1 ? maxYear : prev[name] - 1;
      return { ...prev, [name]: newYear };
    });
  };

  return (
    <div className="course-body">
      <Navbar />

      <div className="GCT-Courses">
        {courseNames.map((name) => {
          const course = tuitionFees[name];
          const year = activeYear[name];

          const firstSem = course.firstSemester[year].total;
          const secondSem = course.secondSemester[year].total;
          const yearlyTotal = firstSem + secondSem;
          const [bigImg] = course.images;

          return (
            <div
              className="CourseCard"
              key={name}
              style={{
                backgroundImage: `url(${course.bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
            >
              {/* LEFT SIDE — image collage */}
              <div className="course-left">
                <div className="collage">
                  <img src={bigImg} className="big-img" alt="" />

                  s
                </div>
                <button className="enroll-btn">Enroll Now</button>
              </div>

              {/* RIGHT SIDE */}
              <div className="course-right">
                <h2>{name}</h2>

                <p className="course-desc">{course.description}</p>

                <div className="tuition-container">
                  <button onClick={() => prevYear(name)} className="arrow-btn">‹</button>

                  <div className="tuition-box">
                    <h3>{year}ᵗʰ Year Tuition Fees</h3>
                    <p>1st Semester: ₱{firstSem.toLocaleString()}</p>
                    <p>2nd Semester: ₱{secondSem.toLocaleString()}</p>
                    <h4>Total: ₱{yearlyTotal.toLocaleString()}</h4>
                  </div>

                  <button onClick={() => nextYear(name)} className="arrow-btn">›</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
