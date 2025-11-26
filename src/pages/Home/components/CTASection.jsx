import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./CTASection.css";

export default function CTASection() {
  const { isAuth, user } = useAuth();

  const role =
    user?.role || user?.accountType || user?.userType || "patient";
  const isPatient = role === "patient";

  const bookingPath = !isAuth
    ? "/signup"
    : isPatient
    ? "/patient/appointments"
    : "/doctor/dashboard";

  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2 className="cta-title">Ready to Get Started?</h2>
        <p className="cta-subtitle">
          Join thousands of satisfied patients who trust MyHealthCare for their medical needs
        </p>
        <div className="cta-buttons">
          <Link to={bookingPath} className="btn-cta-primary">
            Book Appointment
          </Link>
          <Link to="/medical" className="btn-cta-secondary">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
