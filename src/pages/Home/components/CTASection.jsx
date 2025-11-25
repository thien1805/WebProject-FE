import { Link } from "react-router-dom";
import "./CTASection.css";

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2 className="cta-title">Ready to Get Started?</h2>
        <p className="cta-subtitle">
          Join thousands of satisfied patients who trust MyHealthCare for their medical needs
        </p>
        <div className="cta-buttons">
          <Link to="/doctor/dashboard" className="btn-cta-primary">
            Book Appointment
          </Link>
          <Link to="/patient/dashboard" className="btn-cta-secondary">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}

