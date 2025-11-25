import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./Medical.css";
import Dashboard from "../Doctor-dashboard/DoctorDashboard";

const Services = () => {
  const services = [
    {
      image: "/homePage_images/whole-body-thumb.jpg",
      title: "General Health Check & Cancer Screening",
      description: "Comprehensive health assessment and early cancer detection with advanced screening technologies.",
      details: "Our general health check includes complete blood count, metabolic panel, cancer markers, and imaging studies to detect potential health issues early."
    },
    {
      image: "/homePage_images/advancedCheckUp.png",
      title: "Advanced Health Checkup",
      description: "In-depth medical examination with advanced diagnostics and specialized testing.",
      details: "Includes all basic tests plus cardiac stress test, advanced imaging (CT/MRI), endoscopy, and consultation with specialists."
    },
    {
      image: "/homePage_images/healthcheckup.jpeg",
      title: "Basic Health Checkup",
      description: "Essential health screening for preventive care and routine monitoring.",
      details: "Perfect for annual checkups including vital signs, basic blood tests, urinalysis, chest X-ray, and doctor consultation."
    },
    {
      image: "/homePage_images/specifiedCheckUp.png",
      title: "Specialized Health Checkup",
      description: "Targeted health assessments for specific conditions and organ systems.",
      details: "Customized packages for cardiac, diabetes, women's health, men's health, bone health, and other specialized screenings."
    },
    {
      image: "/homePage_images/radiologist.jpg",
      title: "Imaging Diagnosis",
      description: "Advanced imaging technology for accurate diagnosis including X-ray, CT, MRI, and Ultrasound.",
      details: "State-of-the-art imaging equipment operated by experienced radiologists for precise diagnostic results."
    },
    {
      image: "/homePage_images/the-basics-of-bone-joint-care-web.jpg",
      title: "Bone & Joint Care",
      description: "Orthopedic care and joint health specialists for all musculoskeletal conditions.",
      details: "Treatment for arthritis, sports injuries, fractures, joint replacement, and rehabilitation services."
    },
    {
      image: "/homePage_images/Pediatrics.jpeg",
      title: "Pediatrics",
      description: "Comprehensive care for infants, children, and adolescents with experienced pediatricians.",
      details: "Well-child visits, vaccinations, growth monitoring, developmental assessments, and treatment of childhood illnesses."
    },
    {
      image: "/homePage_images/OB-GYN.jpg",
      title: "Obstetrics & Gynecology",
      description: "Women's health and reproductive care with compassionate specialists.",
      details: "Prenatal care, delivery services, gynecological exams, family planning, and menopause management."
    },
    {
      image: "/homePage_images/bethesda-naval-medical-center.jpg",
      title: "ENT - Audiology",
      description: "Ear, nose, throat, and hearing specialists for all ENT conditions.",
      details: "Treatment for hearing loss, sinus problems, throat disorders, balance issues, and hearing aid services."
    }
  ];

  const checkupPackages = services.slice(0, 4);
  const specialties = services.slice(4);
  const specialtiesRef = useRef(null);

  const scrollSpecialties = (direction) => {
    const container = specialtiesRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  const serviceCategories = [
    {
      name: "Preventive Care",
      description: "Regular checkups and screenings to maintain optimal health",
      icon: "🛡️"
    },
    {
      name: "Diagnostic Services",
      description: "Advanced testing and imaging for accurate diagnosis",
      icon: "🔬"
    },
    {
      name: "Specialized Care",
      description: "Expert treatment for specific conditions and organ systems",
      icon: "⚕️"
    },
    {
      name: "Emergency Services",
      description: "24/7 emergency care for urgent medical needs",
      icon: "🚑"
    }
  ];

  return (
    <div className="services-page">
      <Header />

      <main className="services-main">
        {/* Hero Section */}
        <section className="services-hero">
          <div className="hero-content">
            <h1>Our Medical Services</h1>
            <p>
              Comprehensive healthcare solutions delivered by experienced professionals
              using cutting-edge technology
            </p>
          </div>
        </section>

        {/* Service Categories */}
        <section className="categories-section">
          <div className="section-container">
            <h2 className="section-title">Service Categories</h2>
            <div className="categories-grid">
              {serviceCategories.map((category, index) => (
                <div key={index} className="category-card">
                  <div className="category-icon">{category.icon}</div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Services */}
        <section className="all-services-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Comprehensive Medical Services</h2>
              <p className="section-subtitle">
                Comprehensive healthcare services tailored to your needs
              </p>
            </div>

            <div className="checkup-section">
              <div className="subsection-header">
                <div>
                  <h3 className="subsection-title">Health Checkup Packages</h3>

                </div>
              </div>

              <div className="services-grid checkup-grid">
                {checkupPackages.map((service, index) => (
                  <div key={index} className="service-card">
                    <div className="service-image-wrapper">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="service-image"
                      />
                    </div>
                    <div className="service-content">
                      <h3 className="service-title">{service.title}</h3>
                      <p className="service-description">{service.description}</p>
                      <p className="service-details">{service.details}</p>
                      <Link to="/login" className="service-link">
                        Book Appointment <ArrowRight className="link-icon" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="specialties-section">
              <div className="specialties-top">
                <div>
                  <h3 className="subsection-title">Medical Specialties</h3>
                  <p className="subsection-subtitle">
                    Explore specialty services with horizontal scroll
                  </p>
                </div>
                <div className="slider-controls">
                  <button 
                    className="slider-btn" 
                    type="button" 
                    onClick={() => scrollSpecialties("left")}
                    aria-label="Scroll specialties left"
                  >
                    &lt;
                  </button>
                  <button 
                    className="slider-btn" 
                    type="button" 
                    onClick={() => scrollSpecialties("right")}
                    aria-label="Scroll specialties right"
                  >
                    &gt;
                  </button>
                </div>
              </div>

              <div className="specialties-track-wrapper">
                <div className="specialties-track" ref={specialtiesRef}>
                  {specialties.map((service, index) => (
                    <div key={index} className="service-card specialty-card">
                      <div className="service-image-wrapper">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="service-image"
                        />
                      </div>
                      <div className="service-content">
                        <h3 className="service-title">{service.title}</h3>
                        <p className="service-description">{service.description}</p>
                        <p className="service-details">{service.details}</p>
                        <Link to="/login" className="service-link">
                          Book Appointment <ArrowRight className="link-icon" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="services-cta">
          <div className="cta-content">
            <h2>Need Help Choosing the Right Service?</h2>
            <p>Our healthcare advisors are here to guide you</p>
            <div className="cta-buttons">
              <Link to="/login" className="btn-secondary">
                Schedule Consultation
              </Link>
              <Link to='#' className="btn-secondary">
                Call Us Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
