import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Carousel from "./Carousel";
import ServicesSection from "./components/ServicesSection";
import WhyChooseSection from "./components/WhyChooseSection";
import CTASection from "./components/CTASection";
import "./home.css";

const Home = () => {
  return (
    <div className="home-page">
      <Header />

      <main className="main-content">
        {/* Hero Section with Carousel */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="carousel-wrapper">
              <Carousel />
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <ServicesSection />

        {/* Why Choose MyHealthCare Section */}
        <WhyChooseSection />

        {/* Ready to Get Started Section */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
