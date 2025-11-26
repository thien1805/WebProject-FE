// src/pages/PatientDashboard/components/appointments/PatientAppointmentsPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { useAuth } from "../../../../context/AuthContext";

import "../../PatientDashboard.css";
import "./BookingWizard.css";

const STEPS = [
  { id: "symptom", label: "Symptoms" },
  { id: "specialty", label: "Specialty" },
  { id: "doctor", label: "Doctor" },
  { id: "time", label: "Time" },
  { id: "confirm", label: "Confirm" },
];

const SPECIALTIES = [
  { id: "internal", label: "General Internal Medicine", emoji: "🩺" },
  { id: "cardio", label: "Cardiology", emoji: "❤️" },
  { id: "derma", label: "Dermatology", emoji: "🧴" },
  { id: "pedia", label: "Pediatrics", emoji: "👶" },
  { id: "ortho", label: "Orthopedics", emoji: "🦴" },
  { id: "eye", label: "Ophthalmology", emoji: "👁️" },
  { id: "ent", label: "ENT (Ear–Nose–Throat)", emoji: "👂" },
  { id: "dental", label: "Dentistry", emoji: "🦷" },
];

const DOCTORS = [
  {
    id: 1,
    name: "BS. Lê Minh Tuấn",
    specialtyId: "cardio",
    experience: "20 years",
    price: 500000,
    rating: 4.9,
  },
  {
    id: 2,
    name: "BS. Phạm Văn Đức",
    specialtyId: "cardio",
    experience: "18 years",
    price: 450000,
    rating: 4.8,
  },
  {
    id: 3,
    name: "BS. Trần Thị Lan",
    specialtyId: "pedia",
    experience: "12 years",
    price: 400000,
    rating: 4.7,
  },
];

const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

export default function PatientAppointmentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState({
    symptoms: "",
    specialtyId: null,
    doctorId: null,
    date: "",
    timeSlot: "",
    extraNote: "",
  });

  const currentStep = STEPS[stepIndex];
  const selectedSpecialty = SPECIALTIES.find(
    (s) => s.id === form.specialtyId
  );
  const filteredDoctors = DOCTORS.filter(
    (d) => !form.specialtyId || d.specialtyId === form.specialtyId
  );
  const selectedDoctor = DOCTORS.find((d) => d.id === form.doctorId);

  const canGoNext = () => {
    switch (currentStep.id) {
      case "symptom":
        return form.symptoms.trim().length > 0;
      case "specialty":
        return !!form.specialtyId;
      case "doctor":
        return !!form.doctorId;
      case "time":
        return !!form.date && !!form.timeSlot;
      case "confirm":
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canGoNext()) return;

    if (stepIndex < STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      // Final step: submit / call API here later
      console.log("Booking payload:", form);
      alert("Appointment booked successfully (demo).");

      // Demo: go back to dashboard appointments tab
      navigate("/patient/dashboard?tab=appointments");
    }
  };

  const handleBack = () => {
    if (stepIndex === 0) return;
    setStepIndex((prev) => prev - 1);
  };

  const initialLetter = (user?.fullName || user?.name || "P").charAt(0);

  return (
    <>
      <Header />
      <main className="booking-page">
        <div className="booking-container">
          {/* Title */}
          <header className="booking-header">
            <h1 className="booking-title">Book an appointment</h1>
            <p className="booking-subtitle">
              Step {stepIndex + 1} of {STEPS.length}
            </p>
          </header>

          {/* Progress bar */}
          <div className="booking-progress-bar">
            <div
              className="booking-progress-bar-fill"
              style={{
                width: `${((stepIndex + 1) / STEPS.length) * 100}%`,
              }}
            />
          </div>

          {/* Step icons */}
          <div className="booking-steps">
            {STEPS.map((step, idx) => {
              const isActive = idx === stepIndex;
              const isDone = idx < stepIndex;
              return (
                <div key={step.id} className="booking-step-item">
                  <div
                    className={
                      "booking-step-circle" +
                      (isActive ? " booking-step-circle--active" : "") +
                      (isDone ? " booking-step-circle--done" : "")
                    }
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={
                      "booking-step-label" +
                      (isActive ? " booking-step-label--active" : "")
                    }
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Step content card */}
          <section className="booking-card">
            {currentStep.id === "symptom" && (
              <StepSymptom form={form} setForm={setForm} />
            )}

            {currentStep.id === "specialty" && (
              <StepSpecialty
                form={form}
                setForm={setForm}
                specialties={SPECIALTIES}
              />
            )}

            {currentStep.id === "doctor" && (
              <StepDoctor
                form={form}
                setForm={setForm}
                doctors={filteredDoctors}
                selectedSpecialty={selectedSpecialty}
              />
            )}

            {currentStep.id === "time" && (
              <StepTime form={form} setForm={setForm} timeSlots={TIME_SLOTS} />
            )}

            {currentStep.id === "confirm" && (
              <StepConfirm
                form={form}
                selectedSpecialty={selectedSpecialty}
                selectedDoctor={selectedDoctor}
                patientName={user?.fullName || user?.name || "Patient"}
                initialLetter={initialLetter}
              />
            )}
          </section>

          {/* Navigation buttons */}
          <footer className="booking-footer">
            <button
              type="button"
              className="booking-btn booking-btn--ghost"
              disabled={stepIndex === 0}
              onClick={handleBack}
            >
              ◀ Back
            </button>

            <button
              type="button"
              className={
                "booking-btn booking-btn--primary" +
                (!canGoNext() ? " booking-btn--disabled" : "")
              }
              onClick={handleNext}
              disabled={!canGoNext()}
            >
              {stepIndex === STEPS.length - 1
                ? "Proceed to payment ➜"
                : "Continue ➜"}
            </button>
          </footer>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ===== Step components ===== */

function StepSymptom({ form, setForm }) {
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, symptoms: e.target.value }));
  };

  const handleAIDemo = () => {
    alert(
      "Demo only: in the future we can use AI to suggest a specialty based on your symptoms."
    );
  };

  return (
    <>
      <h2 className="booking-section-title">Describe your symptoms</h2>
      <p className="booking-section-subtitle">
        Tell us about your symptoms so we can suggest a suitable specialty.
      </p>

      <label className="booking-field-label">Your symptoms</label>
      <textarea
        className="booking-textarea"
        rows={5}
        placeholder="Example: High fever, persistent cough, headache..."
        value={form.symptoms}
        onChange={handleChange}
      />

      <button
        type="button"
        className="booking-btn booking-btn--ai"
        onClick={handleAIDemo}
      >
        ⚡ Get AI suggestion
      </button>
    </>
  );
}

function StepSpecialty({ form, setForm, specialties }) {
  return (
    <>
      <h2 className="booking-section-title">Choose a specialty</h2>
      <p className="booking-section-subtitle">
        Select a specialty based on your symptoms or AI suggestions.
      </p>

      <div className="booking-specialty-grid">
        {specialties.map((spec) => {
          const isActive = form.specialtyId === spec.id;
          return (
            <button
              key={spec.id}
              type="button"
              className={
                "booking-specialty-card" +
                (isActive ? " booking-specialty-card--active" : "")
              }
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  specialtyId: spec.id,
                  doctorId: null, // reset doctor when changing specialty
                }))
              }
            >
              <div className="booking-specialty-emoji">{spec.emoji}</div>
              <div className="booking-specialty-name">{spec.label}</div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepDoctor({ form, setForm, doctors, selectedSpecialty }) {
  return (
    <>
      <h2 className="booking-section-title">Choose a doctor</h2>
      <p className="booking-section-subtitle">
        {selectedSpecialty
          ? `Specialty: ${selectedSpecialty.label}`
          : "Choose a specialty first to see available doctors."}
      </p>

      <div className="booking-doctor-list">
        {doctors.map((doc) => {
          const isActive = form.doctorId === doc.id;
          return (
            <button
              key={doc.id}
              type="button"
              className={
                "booking-doctor-card" +
                (isActive ? " booking-doctor-card--active" : "")
              }
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  doctorId: doc.id,
                }))
              }
            >
              <div className="booking-doctor-avatar">👨‍⚕️</div>
              <div className="booking-doctor-info">
                <div className="booking-doctor-name">{doc.name}</div>
                <div className="booking-doctor-exp">
                  Experience: {doc.experience}
                </div>
                <div className="booking-doctor-meta">
                  ⭐ {doc.rating.toFixed(1)} •{" "}
                  {doc.price.toLocaleString("vi-VN")} VND
                </div>
              </div>
            </button>
          );
        })}

        {doctors.length === 0 && (
          <div className="booking-empty">
            Please choose a specialty first to see matching doctors.
          </div>
        )}
      </div>
    </>
  );
}

function StepTime({ form, setForm, timeSlots }) {
  return (
    <>
      <h2 className="booking-section-title">Select date and time</h2>
      <p className="booking-section-subtitle">
        Choose a convenient date and time for your visit.
      </p>

      <div className="booking-time-layout">
        <div className="booking-date-picker">
          <label className="booking-field-label">Appointment date</label>
          <input
            type="date"
            className="booking-date-input"
            value={form.date}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, date: e.target.value }))
            }
          />
        </div>

        <div className="booking-time-slots">
          <label className="booking-field-label">Time slot</label>
          <div className="booking-time-grid">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={
                  "booking-time-slot" +
                  (form.timeSlot === slot ? " booking-time-slot--active" : "")
                }
                onClick={() =>
                  setForm((prev) => ({ ...prev, timeSlot: slot }))
                }
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      <label className="booking-field-label">Additional notes (optional)</label>
      <textarea
        className="booking-textarea"
        rows={3}
        placeholder="Add any important information about your health condition..."
        value={form.extraNote}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, extraNote: e.target.value }))
        }
      />
    </>
  );
}

function StepConfirm({
  form,
  selectedSpecialty,
  selectedDoctor,
  patientName,
  initialLetter,
}) {
  return (
    <>
      <h2 className="booking-section-title">Review your details</h2>
      <p className="booking-section-subtitle">
        Please check the information before proceeding to payment.
      </p>

      <div className="booking-confirm-card">
        <div className="booking-confirm-row">
          <span className="booking-confirm-label">Patient:</span>
          <span className="booking-confirm-value">
            <span className="booking-confirm-avatar">{initialLetter}</span>
            {patientName}
          </span>
        </div>

        <div className="booking-confirm-row">
          <span className="booking-confirm-label">Symptoms:</span>
          <span className="booking-confirm-value">
            {form.symptoms || "Not provided"}
          </span>
        </div>

        <div className="booking-confirm-row">
          <span className="booking-confirm-label">Specialty:</span>
          <span className="booking-confirm-value">
            {selectedSpecialty?.label || "Not selected"}
          </span>
        </div>

        <div className="booking-confirm-row">
          <span className="booking-confirm-label">Doctor:</span>
          <span className="booking-confirm-value">
            {selectedDoctor?.name || "Not selected"}
          </span>
        </div>

        <div className="booking-confirm-row">
          <span className="booking-confirm-label">Date:</span>
          <span className="booking-confirm-value">
            {form.date || "Not selected"}
          </span>
        </div>

        <div className="booking-confirm-row">
          <span className="booking-confirm-label">Time:</span>
          <span className="booking-confirm-value">
            {form.timeSlot || "Not selected"}
          </span>
        </div>

        <div className="booking-confirm-row booking-confirm-row--price">
          <span className="booking-confirm-label">Consultation fee:</span>
          <span className="booking-confirm-price">
            {selectedDoctor
              ? selectedDoctor.price.toLocaleString("vi-VN") + " VND"
              : "—"}
          </span>
        </div>
      </div>
    </>
  );
}
