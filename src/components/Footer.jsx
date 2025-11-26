import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo/Logo";
import { useAuth } from "../context/AuthContext";
import "./Footer.css";

const Footer = () => {
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
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* About */}
          <div className="footer-section">
            <Logo clickable={false} className="footer-logo-custom" />
            <p className="footer-description">
              Your trusted partner in health and wellness.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <Facebook className="social-icon" />
              </a>
              <a href="#" className="social-link">
                <Twitter className="social-icon" />
              </a>
              <a href="#" className="social-link">
                <Instagram className="social-icon" />
              </a>
              <a href="#" className="social-link">
                <Linkedin className="social-icon" />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-list">
              <li><Link to="#" className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</Link></li>
              <li><Link to="/about" className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>About Us</Link></li>
              <li><Link to="/medical" className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Services</Link></li>
              <li><Link to={bookingPath} className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Booking</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-title">Services</h4>
            <ul className="footer-list">
              <li><a href="/medical" className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>General Health Check</a></li>
              <li><a href="/medical" className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Diagnostic Services</a></li>
              <li><a href="/medical" className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Bone & Joint Care</a></li>
              <li><a href="/medical" className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Pediatrics</a></li>
              <li><a href="/medical" className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Obstetrics & Gynecology</a></li>
              <li><a href="/medical" className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Audiology</a></li>

            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-title">Contact Us</h4>
            <ul className="contact-list">
              <li className="contact-item">
                <Phone className="contact-icon" />
                <span className="contact-text">+1 (555) 123-4567</span>
              </li>
              <li className="contact-item">
                <Mail className="contact-icon" />
                <Link to= 'https://mail.google.com/mail/u/0/#inbox?compose=GTvVlcSKhbtspNvxjxFRBgRnQlPBgLQvpvwrTwSHXpnBGClSbzbgCqdTCTKbFtNzDCqPRrdMFmLKp' target="_blank" rel="noopener noreferrer" className="contact-text">myhealthcare@gmail.com</Link>
              </li>
              <li className="contact-item">
                <MapPin className="contact-icon" />
                <Link to='https://www.google.com/maps/place/University+of+Information+Technology+-+VNUHCM/@10.8700142,106.8004792,814m/data=!3m2!1e3!4b1!4m6!3m5!1s0x317527587e9ad5bf:0xafa66f9c8be3c91!8m2!3d10.8700089!4d106.8030541!16s%2Fm%2F02qqlmm?entry=ttu&g_ep=EgoyMDI1MTExOC4wIKXMDSoASAFQAw%3D%3D' target="_blank" rel="noopener noreferrer" className="contact-text">6 Han Thuyen, Thu Duc</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2025 MyHealthCare. All rights reserved.
            </p>
            <div className="footer-links">
              <a href="#" className="footer-bottom-link">Privacy Policy</a>
              <a href="#" className="footer-bottom-link">Terms of Service</a>
              <a href="#" className="footer-bottom-link">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
