import React from "react";
import Logo from "../../components/Logo/Logo";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./Aboutus.css";

const AboutUs = () => {
  return (
    <div className="aboutus-page">
      <Header />
      
      <main>
        <div className="container">
          <h1>About Us</h1>

          <section className="about-hospital">
            <h2>Welcome to UIT Hospital</h2>
            <div className="content-wrapper">
              <div className="text-content">
                <p>
                  Welcome patients, families, and partners to{" "}
                  <strong>UIT Hospital</strong>. We are proud to be a leading
                  healthcare institution, driven by our mission to provide
                  comprehensive, high-quality medical care to the community.
                </p>
                <p>
                  With a team of highly specialized and experienced medical
                  professionals and a system of state-of-the-art medical
                  equipment, we are committed to prioritizing patient health and
                  safety above all else. At UIT Hospital, we don't just treat
                  diseases; we care with compassion, delivering a professional and
                  considerate experience.
                </p>
              </div>
              <div className="image-wrapper">
                <img
                  src="/aboutUs_img/doctors-team.png"
                  alt="Doctor teams in UIT Hospital"
                />
              </div>
            </div>
          </section>

          <section className="about-website">
            <h2>The "MyHealthCare" Website: Your Bridge to Better Health</h2>
            <p>
              In this digital age, we understand that convenience and proactivity
              in managing one's health are paramount. The "MyHealthCare" website
              was created to fulfill that commitment.
            </p>
            <p>
              "MyHealthCare" is the official medical portal and online interaction
              platform for UIT Hospital. It is not only a source for reliable
              medical information and the latest hospital news but also your
              dedicated assistant, helping you access our medical services quickly
              and easily.
            </p>
          </section>

          <section className="features">
            <h2>Key Features of "MyHealthCare"</h2>
            <p>
              We have built this website with powerful features designed to serve
              the distinct needs of both our patients and our medical staff:
            </p>

            <div className="features-grid">
              <div className="feature-item">
                <h3>Effortless Information Access</h3>
                <p>
                  Discover detailed information about our specialized departments
                  (such as Bone &amp; Joint, Obstetrics &amp; Gynecology,
                  Pediatrics...), learn about our team of doctors, and stay
                  updated on the latest health news and promotions from the
                  hospital.
                </p>
              </div>
              <div className="feature-item">
                <h3>24/7 Online Appointment Booking</h3>
                <p>
                  Whether you are a new patient or already have a record with us,
                  our system allows you to register an account and proactively
                  book appointments online, anytime, anywhere. In just a few
                  simple steps, you can select the specialty, doctor, and time
                  slot that works best for you, eliminating the need for phone
                  calls or waiting.
                </p>
              </div>
              <div className="feature-item">
                <h3>Dedicated Doctor Portal</h3>
                <p>
                  To ensure an efficient and accurate workflow, "MyHealthCare"
                  also provides a secure, separate login portal for our medical
                  staff. This system allows our doctors to manage patient
                  examination lists, track upcoming appointments, and best prepare
                  for treatment, optimizing the entire consultation process for
                  our patients.
                </p>
              </div>
                <div className="feature-item">
                <h3>Personal Health Record Dashboard</h3>
                <p>
                  View and manage your health information in one secure place. After
                  logging in, you can review your visit history, prescriptions, test
                  results, and upcoming appointments through a simple, visual dashboard.
                  This helps you follow your treatment plan, share accurate information
                  with doctors, and stay more in control of your health.
                </p>
              </div>
            </div>
          </section>

          <section className="commitment">
            <h2>Our Commitment</h2>
            <p>
              UIT Hospital and the "MyHealthCare" platform are continually
              striving to improve our quality of service. We aim to be your
              trusted partner on the journey to caring for and protecting the
              health of you and your family.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;