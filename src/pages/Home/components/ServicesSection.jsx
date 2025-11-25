import { Stethoscope, Calendar, User, Clock } from "lucide-react";
import "./ServicesSection.css";

const services = [
  {
    icon: Stethoscope,
    title: "General Consultation",
    description: "Comprehensive health check-ups and medical consultations with our experienced doctors.",
  },
  {
    icon: Calendar,
    title: "Easy Appointment Booking",
    description: "Book your appointments online with just a few clicks. Choose your preferred time and doctor.",
  },
  {
    icon: User,
    title: "Patient Portal",
    description: "Access your medical records, test results, and prescriptions anytime, anywhere.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock emergency support and medical assistance whenever you need it.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="services-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Experience comprehensive healthcare services designed with your well-being in mind
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="service-card">
                <div className="service-icon-wrapper">
                  <IconComponent className="service-icon" />
                </div>
                <div className="service-content">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

