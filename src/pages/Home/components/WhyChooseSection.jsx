import { CheckCircle2 } from "lucide-react";
import "./WhyChooseSection.css";

const whyChoose = [
  {
    title: "Expert Medical Team",
    description: "Highly qualified and experienced medical professionals dedicated to your health.",
  },
  {
    title: "Modern Facilities",
    description: "State-of-the-art medical equipment and comfortable facilities for the best patient experience.",
  },
  {
    title: "Patient-Centered Care",
    description: "We prioritize your comfort and well-being with personalized care and attention.",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="why-choose-section">
      <div className="section-container">
        <div className="why-choose-content">
          <div className="why-choose-text">
            <h2 className="section-title">Why Choose MyHealthCare?</h2>
            <div className="why-choose-list">
              {whyChoose.map((item, index) => (
                <div key={index} className="why-choose-item">
                  <CheckCircle2 className="check-icon" />
                  <div>
                    <h3 className="why-choose-item-title">{item.title}</h3>
                    <p className="why-choose-item-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="why-choose-image">
            <img 
              src="/homePage_images/medical-equipment.jpg" 
              alt="Modern medical facilities"
              className="why-choose-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

