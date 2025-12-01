import React from "react";
import Navbar from "../Components/Navbar";
import "../History.css";

const historySections = [
  {
    title: "Founding of GCT",
    paragraphs: [
      `Garcia College of Technology (GCT) is widely recognized as the premier business and engineering school in Kalibo, Aklan. Founded in 1968 by the late Don Florencio M. Garcia and Doña Enrica Reyes Garcia, the institution has grown from a modest technical school into a respected center for higher learning in the province. Throughout the years, it has steadily expanded its programs to respond to the evolving needs of both industry and the local community, ensuring that students receive education that is both relevant and future-ready. GCT has continued to refine academic offerings that balance practical skills with strong theoretical foundations, allowing learners to develop confidence and competence in their chosen fields. These continuous improvements have enabled the institution to guide students toward meaningful and productive careers while fostering values that support personal and professional growth. Today, GCT stands as a trusted institution dedicated to shaping capable professionals and future leaders, upholding a legacy of quality education that has served Aklan for generations.`,
      `Over the decades, GCT embraced modernization while preserving the traditional values that defined its identity. The institution strengthened its academic offerings, invested in updated laboratories and learning spaces, and incorporated innovative teaching methods suited to the needs of an evolving society. These efforts enabled the school to create an environment where students could grow intellectually, develop character, and gain the competencies required to thrive in diverse fields. With a strong commitment to community involvement and student-centered education, GCT continues to empower individuals who contribute significantly to their professions and local communities. Today, the institution stands as a testament to its founders’ vision—a dynamic and enduring center of education dedicated to nurturing future leaders of Aklan and beyond.`
    ],
    image: "/Assets/Founders.png",
    alt: "Founders of GCT"
  },
  {
    title: "Growth and Development",
    paragraphs: [
      `Garcia College of Technology (GCT) was founded in 1968 by the late Don Florencio M. Garcia and Doña Enrica Reyes Garcia, who envisioned an institution dedicated to providing high-quality education to the youth of Kalibo, Aklan, and surrounding communities. What began as a small technical school with limited resources and a modest student body quickly grew into a respected center of learning, driven by the founders’ unwavering commitment to academic excellence, practical skills, and character formation. From its earliest days, GCT focused on programs in business and engineering, equipping students with the knowledge and competencies necessary to succeed in a rapidly developing economy. Over the years, the institution steadily expanded its facilities, curriculum, and faculty, embracing modern teaching methods while maintaining its core values of integrity, hard work, and service. This dedication laid the foundation for GCT’s enduring reputation as a premier institution, inspiring generations of students to pursue their dreams and excel in their chosen fields.`,
      `Year after year, GCT has focused on continually raising its academic standards by enhancing its curriculum, expanding program offerings, and upgrading facilities to meet the evolving needs of students. The institution has remained steadfast in its mission to deliver quality education in business, engineering, and technology while fostering critical thinking, professionalism, and social responsibility. Through its commitment to excellence, GCT has established itself as a leading center for higher learning in Kalibo, Aklan, and has consistently produced graduates who excel both locally and nationally.`,
      `Building on its strong foundation in tertiary education, GCT eventually expanded into basic education, offering programs for pre-school, elementary, and high school students. Leveraging decades of experience, the administration ensured that younger learners received the same high-quality education and holistic formation that the college is known for. GCT also became more visible in the community through outreach initiatives, educational partnerships, and media engagements, instilling in its students the values of youth empowerment, civic responsibility, and the drive to effect positive change in society. These efforts have solidified GCT’s role as an institution committed not only to academic achievement but also to nurturing future leaders and innovators.`
    ],
    image: "/Assets/oldcom.jpg",
    alt: "GCT Campus"
  },
  {
    title: "Today’s GCT",
    paragraphs: [
      `Today, GCT stands as a premier institution in Aklan, combining traditional values with modern education practices. Over the years, it has evolved into a respected center of learning recognized for its commitment to academic excellence, character formation, and community involvement. The institution continually refines its programs to meet the demands of an ever-changing world, ensuring that students receive a balanced education rooted in discipline, integrity, and forward-thinking approaches. With upgraded facilities, dedicated faculty, and a curriculum that integrates both theoretical foundations and hands-on applications, GCT equips learners with the necessary skills and mindset to excel in their chosen fields. This culture of continuous improvement, innovation, and leadership development empowers students to thrive not only academically but also personally, making the institution a trusted and enduring pillar of quality education in the province. Through its unwavering dedication to student success, GCT continues to set a standard of excellence that inspires growth and achievement across generations.`,
      `As it moves forward, GCT remains committed to strengthening its role as a transformative educational institution within the region. The school continues to expand opportunities for students through enhanced academic offerings, industry partnerships, and community-centered initiatives that promote civic engagement and social responsibility. By embracing technological advancements while preserving its core values, GCT fosters an environment where students are encouraged to grow, lead, and contribute meaningfully to their communities. With graduates who consistently demonstrate competence, professionalism, and strong moral character, the institution upholds its vision of shaping individuals who can meet the challenges of modern society and drive positive change for future generations.`
    ],
    image: "/Assets/school.jpg",
    alt: "GCT Modern Campus"
  },
];

const History = () => {
  return (
    <>
      <Navbar />

      <div className="history-page-container">
        {/* Page title */}
        <h1 className="history-page-title">
          The History of Garcia College and Technology
        </h1>

        {historySections.map((section, index) => (
          <section className="history-section" key={index}>
            {/* Top row: first paragraph + image */}
            <div className="history-top-row">
              <div className="history-text-column">
                <h2>{section.title}</h2>
                <p>{section.paragraphs[0]}</p>
              </div>
              <div className="history-image-column">
                <img src={section.image} alt={section.alt} />
              </div>
            </div>

            {/* Bottom row: extra paragraphs full width */}
            {section.paragraphs.length > 1 && (
              <div className="history-fullwidth-text">
                {section.paragraphs.slice(1).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

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

    </>
  );
};

export default History;
