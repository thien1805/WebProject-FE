import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Carousel.css";

const slides = [
  {
    image: "/homePage_images/homepage1.png",
    title: "Welcome to MyHealthCare",
    subtitle: "Your trusted partner in health. Book appointments, access medical records, and connect with healthcare professionals.",
  },
  {
    image: "/homePage_images/homepage2.png",
    title: "State-of-the-art Facilities",
    subtitle: "Modern equipment, comfortable environment, expert staff for comprehensive care.",
  },
  {
    image: "/homePage_images/homepage3.png",
    title: "Your Trusted Partner in Health and Wellness",
    subtitle: "Building healthier communities, one family at a time.",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const { isAuth, user } = useAuth();

  const role =
    user?.role || user?.accountType || user?.userType || "patient";
  const isPatient = role === "patient";

  const bookingPath = !isAuth
    ? "/signup"
    : isPatient
    ? "/patient/appointments"
    : "/doctor/dashboard";

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`carousel-slide ${i === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-content">
            <h1 className="slide-title">{slide.title}</h1>
            <p className="slide-subtitle">{slide.subtitle}</p>
          </div>
        </div>
      ))}

      {/* Fixed Button */}
      <div className="slide-button-wrapper">
        <Link to={bookingPath} className="slide-button">
          Book an Appointment
        </Link>
      </div>

      {/* Navigation arrows */}
      <div className="carousel-nav">
        <button className="carousel-btn prev-btn" onClick={prevSlide}>
          ‹
        </button>
        <button className="carousel-btn next-btn" onClick={nextSlide}>
          ›
        </button>
      </div>

      {/* Dots indicator */}
      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
