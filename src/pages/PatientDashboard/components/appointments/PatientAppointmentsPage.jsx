// src/pages/PatientDashboard/components/appointments/PatientAppointmentsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { useAuth } from "../../../../context/AuthContext";

import {
  getAvailableSlots,
  bookAppointment,
  suggestDepartmentAI,
  getDepartments,
} from "../../../../api/appointmentAPI";

import "../../PatientDashboard.css";
import "./BookingWizard.css";

const STEPS = [
  { id: "symptom", label: "Symptoms" },
  { id: "specialty", label: "Specialty" },
  { id: "doctor", label: "Doctor" },
  { id: "time", label: "Time" },
  { id: "confirm", label: "Confirm" },
];

// Fallback specialties if API fails
const FALLBACK_SPECIALTIES = [
  { id: 1, name: "General Internal Medicine", icon: "🩺" },
  { id: 2, name: "Cardiology", icon: "❤️" },
  { id: 3, name: "Dermatology", icon: "🧴" },
  { id: 4, name: "Pediatrics", icon: "🧸" },
  { id: 5, name: "Orthopedics", icon: "🦴" },
  { id: 6, name: "Ophthalmology", icon: "👁️" },
  { id: 7, name: "ENT (Ear-Nose-Throat)", icon: "👂" },
  { id: 8, name: "Dentistry", icon: "🦷" },
];

const DOCTORS = [
  // Keep existing for now until doctor API is integrated
  {
    id: 1,
    name: "BS. Lê Minh Tuấn",
    departmentId: 2, // Cardiology
    experience: "20 years",
    price: 500000,
    rating: 4.9,
  },
  // ...other doctors
];

// Fallback time slots
const FALLBACK_TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00",
  "10:30", "11:00", "11:30", "13:30", "14:00",
  "14:30", "15:00", "15:30", "16:00", "16:30",
];

const DEFAULT_SERVICE_ID = 3;



export default function PatientAppointmentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState({
    symptoms: "",
    departmentId: null,
    doctorId: null,
    date: "",
    timeSlot: "",
    extraNote: "",
    // serviceId: null, // để dành sau
  });

  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const currentStep = STEPS[stepIndex];
  const selectedSpecialty = departments.find(
    (d) => d.id === form.departmentId
  );
  const filteredDoctors = DOCTORS.filter(
    (d) => !form.departmentId || d.departmentId === form.departmentId
  );
  const selectedDoctor = DOCTORS.find((d) => d.id === form.doctorId);

  // Get patient name from user object - try multiple field names
  const getPatientName = () => {
    if (!user) return "Patient";
    // Backend uses snake_case (full_name), try different variations
    return (
      user.full_name ||      // Backend Django API (snake_case)
      user.fullName ||       // Some APIs (camelCase)
      user.name ||           // Alternative
      user.first_name ||     // Some APIs
      user.firstName ||      // camelCase alternative
      user.email?.split("@")[0] || // Fallback to email prefix
      "Patient"
    );
  };

  const patientName = getPatientName();
  const initialLetter = patientName.charAt(0).toUpperCase();

  // ===== Load available time slots từ backend khi doctor/date đổi =====
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const data = await getDepartments({ page: 1, pageSize: 50 });
        //API returns paginated: { results: [...]}
        const deptList = data.results || data || [];  
        if (deptList.length > 0){
          setDepartments(deptList);
        } else {
          setDepartments(FALLBACK_SPECIALTIES);
        }
      } catch (err) {
        console.error("Error loading departments:", err);
        setDepartments(FALLBACK_SPECIALTIES);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);


  // ===== Load available time slots =====
  useEffect(() => {
    const {doctorId, date} = form;
    if (!doctorId || !date) {
      setTimeSlots([]);
      return;
    }

    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        const data = await getAvailableSlots({
        doctorId,
        date,
        departmentId: form.departmentId,
      });
      const available = (data.available_slots || [])
      .filter((slot) => slot.available)
      .map((slot) => slot.time);

      setTimeSlots(available.length > 0 ? available : FALLBACK_TIME_SLOTS);
    } catch (err) {
        console.error("Error loading time slots:", err);
        setTimeSlots(FALLBACK_TIME_SLOTS);
      } finally {
        setLoadingSlots(false);
      }
    };


    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.doctorId, form.date, form.departmentId]);

  const canGoNext = () => {
    switch (currentStep.id) {
      case "symptom":
        return form.symptoms.trim().length > 0;
      case "specialty":
        return !!form.departmentId;
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

  const handleNext = async () => {
    if (!canGoNext()) return;

    if (stepIndex < STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      // ===== TODO: GỌI API BOOK APPOINTMENT Ở ĐÂY =====
      try {
        setBookingLoading(true);

        const payload = {
          doctor_id: form.doctorId,
          department_id: form.departmentId, 
          service_id: DEFAULT_SERVICE_ID,
          appointment_date: form.date,
          appointment_time: form.timeSlot,
          symptoms: form.symptoms,
          reason: form.symptoms,
          notes: form.extraNote,
        };
        const res = await bookAppointment(payload);
        console.log("Book appointment response:", res);

        if (!res?.success) {
          throw new Error(res?.message || "Booking failed");
        }

        exportBookingTicket({
          patientName: user?.fullName || user?.name || "Patient",
          symptoms: form.symptoms,
          specialty: selectedSpecialty?.name,
          doctor: selectedDoctor?.name,
          date: form.date,
          time: form.timeSlot,
          price: selectedDoctor
            ? `${selectedDoctor.price.toLocaleString("vi-VN")} VND`
            : "N/A",
        });

        alert(
          "Appointment booked successfully!"
        );
        navigate("/patient/dashboard?tab=appointments");
      } catch (err) {
        console.error("Book appointment error:", err);
        alert(
          err?.message ||
            "Something went wrong while booking the appointment."
        );
      } finally {
        setBookingLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (stepIndex === 0) return;
    setStepIndex((prev) => prev - 1);
  };

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
                departments={departments}
                loading={loadingDepartments}
              />
            )}

            {currentStep.id === "doctor" && (
              <StepDoctor
                form={form}
                setForm={setForm}
                doctors={filteredDoctors}
                selectedDepartment={selectedSpecialty}
              />
            )}

            {currentStep.id === "time" && (
              <StepTime
                form={form}
                setForm={setForm}
                timeSlots={timeSlots}
                loadingSlots={loadingSlots}
              />
            )}

            {currentStep.id === "confirm" && (
              <StepConfirm
                form={form}
                selectedSpecialty={selectedSpecialty}
                selectedDoctor={selectedDoctor}
                patientName={patientName}
                initialLetter={initialLetter}
              />
            )}
          </section>

          {/* Navigation buttons */}
          <footer className="booking-footer">
            <button
              type="button"
              className="booking-btn booking-btn--ghost"
              disabled={stepIndex === 0 || bookingLoading}
              onClick={handleBack}
            >
              ← Back
            </button>

            <button
              type="button"
              className={
                "booking-btn booking-btn--primary" +
                (!canGoNext() || bookingLoading
                  ? " booking-btn--disabled"
                  : "")
              }
              onClick={handleNext}
              disabled={!canGoNext() || bookingLoading}
            >
              {stepIndex === STEPS.length - 1
                ? bookingLoading
                  ? "Booking..."
                  : "Confirm & download ticket"
                : "Continue →"}
            </button>
          </footer>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ===== Symptom options for chips ===== */
const SYMPTOM_OPTIONS = [
  { id: "fever", label: "Fever" },
  { id: "cough", label: "Cough" },
  { id: "headache", label: "Headache" },
  { id: "fatigue", label: "Fatigue" },
  { id: "chest_pain", label: "Chest Pain" },
  { id: "shortness_breath", label: "Shortness of Breath" },
  { id: "nausea", label: "Nausea" },
  { id: "dizziness", label: "Dizziness" },
  { id: "skin_rash", label: "Skin Rash" },
  { id: "joint_pain", label: "Joint Pain" },
  { id: "sore_throat", label: "Sore Throat" },
  { id: "stomach_ache", label: "Stomach Ache" },
];

/* ===== Step components ===== */

function StepSymptom({ form, setForm }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, symptoms: e.target.value }));
  };

  const toggleSymptom = (id) => {
    setSelectedSymptoms((prevIds) => {
      let nextIds;
      if (prevIds.includes(id)) {
        nextIds = prevIds.filter((x) => x !== id);
      } else {
        nextIds = [...prevIds, id];
      }

      // Cập nhật text symptoms từ chip
      const text = SYMPTOM_OPTIONS.filter((opt) =>
        nextIds.includes(opt.id)
      )
        .map((opt) => opt.label)
        .join(", ");

      setForm((prev) => ({
        ...prev,
        symptoms: text || prev.symptoms,
      }));

      return nextIds;
    });
  };

  const handleAISuggest = async () => {
    // Lần bấm đầu chỉ mở danh sách gợi ý
    if (!showSuggestions) {
      setShowSuggestions(true);
      return;
    }

    if (!selectedSymptoms.length && !form.symptoms.trim()) {
      alert("Vui lòng chọn hoặc nhập ít nhất một triệu chứng.");
      return;
    }

    setLoading(true);
    setAiResult(null);

    try {
      // Call AI suggest department API
      const res = await suggestDepartmentAI({
        symptoms: form.symptoms,
        // age and gender can be added if available from user profile
      });

      if (res?.success && res.primary_department) {
        const dept = res.primary_department;

        // Update form with suggested department
        setForm((prev) => ({
          ...prev,
          departmentId: dept.id,
        }));

        setAiResult({
          success: true,
          department: dept,
          reason: res.reason,
          urgency: res.urgency
        });
      } else {
        setAiResult({
          success: false,
          error: res?.error || "Không thể nhận được gợi ý từ AI. Vui lòng chọn thủ công."
        });
      }
    } catch (error) {
      console.error("AI suggestion error:", error);
      setAiResult({
        success: false,
        error: error?.error || "Không thể nhận được gợi ý từ AI. Vui lòng chọn thủ công."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="booking-section-title">🩺 Mô tả triệu chứng</h2>
      <p className="booking-section-subtitle">
        Mô tả triệu chứng để AI gợi ý chuyên khoa phù hợp
      </p>

      <label className="booking-field-label">Triệu chứng của bạn</label>
      <textarea
        className="booking-textarea"
        rows={4}
        placeholder="Ví dụ: Đau bụng, buồn nôn, chóng mặt..."
        value={form.symptoms}
        onChange={handleChange}
      />

      <button
        type="button"
        className="booking-btn booking-btn--ai"
        onClick={handleAISuggest}
        disabled={loading || !form.symptoms.trim()}
      >
        {loading ? (
          <>
            <span className="booking-btn-spinner">🔄</span>
            Đang phân tích...
          </>
        ) : (
          <>
            <span>🤖</span>
            Nhận gợi ý từ AI
          </>
        )}
      </button>

      {/* AI Result Card */}
      {aiResult && aiResult.success && (
        <div className="ai-result-card">
          <div className="ai-result-header">
            <span className="ai-result-icon">✨</span>
            <h3>Gợi ý từ AI</h3>
          </div>
          
          <div className="ai-result-body">
            <p className="ai-result-intro">
              Dựa trên triệu chứng, chúng tôi gợi ý các chuyên khoa sau:
            </p>

            <div className="ai-suggestion-item">
              <div className="ai-suggestion-badge">Nội khoa</div>
              <div className="ai-suggestion-badge ai-suggestion-badge--secondary">Tổng quát</div>
            </div>

            <div className="ai-result-department">
              <div className="ai-result-dept-icon">🏥</div>
              <div className="ai-result-dept-info">
                <h4>{aiResult.department.name}</h4>
                <p className="ai-result-reason">{aiResult.reason}</p>
              </div>
            </div>

            {aiResult.urgency && (
              <div className={`ai-urgency-indicator ai-urgency-${aiResult.urgency}`}>
                <span className="ai-urgency-icon">
                  {aiResult.urgency === 'high' ? '⚠️' : aiResult.urgency === 'medium' ? '⚡' : 'ℹ️'}
                </span>
                <span className="ai-urgency-text">
                  Mức độ: {aiResult.urgency === 'high' ? 'Khẩn cấp' : aiResult.urgency === 'medium' ? 'Trung bình' : 'Thấp'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {aiResult && !aiResult.success && (
        <div className="ai-result-card ai-result-card--error">
          <div className="ai-result-header">
            <span className="ai-result-icon">⚠️</span>
            <h3>Không thể nhận gợi ý</h3>
          </div>
          <div className="ai-result-body">
            <p>{aiResult.error}</p>
          </div>
        </div>
      )}
    </>
  );
}

function StepSpecialty({ form, setForm, departments, loading }) {
  if (loading) {
    return (
      <div className="booking-loading">
        <p>Loading departments...</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="booking-section-title">Choose a specialty</h2>
      <p className="booking-section-subtitle">
        Select a specialty based on your symptoms or AI suggestions.
      </p>

      <div className="booking-specialty-grid">
        {departments.map((dept) => {
          const isActive = form.departmentId === dept.id;
          // Use icon from API or fallback emoji
          const emoji = dept.icon || "🏥";
          return (
            <button
              key={dept.id}
              type="button"
              className={
                "booking-specialty-card" +
                (isActive ? " booking-specialty-card--active" : "")
              }
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  departmentId: dept.id,
                  doctorId: null, // reset doctor when changing department
                  timeSlot: "",
                }))
              }
            >
              <div className="booking-specialty-emoji">{emoji}</div>
              <div className="booking-specialty-name">{dept.name}</div>
              {dept.health_examination_fee && (
                <div className="booking-specialty-fee">
                  {dept.health_examination_fee.toLocaleString("vi-VN")} VND
                </div>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepDoctor({ form, setForm, doctors, selectedDepartment }) {
  return (
    <>
      <h2 className="booking-section-title">Choose a doctor</h2>
      <p className="booking-section-subtitle">
        {selectedDepartment
          ? `Department: ${selectedDepartment.name}`
          : "Choose a department first to see available doctors."}
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
                  timeSlot: "",
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

function StepTime({ form, setForm, timeSlots, loadingSlots }) {
  const hasDoctorAndDate = form.doctorId && form.date;

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
              setForm((prev) => ({
                ...prev,
                date: e.target.value,
                timeSlot: "",
              }))
            }
          />
        </div>

        <div className="booking-time-slots">
          <label className="booking-field-label">Time slot</label>

          {loadingSlots ? (
            <div className="booking-empty">Loading available slots...</div>
          ) : !hasDoctorAndDate ? (
            <div className="booking-empty">
              Please select a doctor and date first.
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="booking-empty">
              No available slots for this date. Please choose another date.
            </div>
          ) : (
            <div className="booking-time-grid">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={
                    "booking-time-slot" +
                    (form.timeSlot === slot
                      ? " booking-time-slot--active"
                      : "")
                  }
                  onClick={() =>
                    setForm((prev) => ({ ...prev, timeSlot: slot }))
                  }
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
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
        Please check the information before confirming your booking.
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
          <span className="booking-confirm-label">Department:</span>
          <span className="booking-confirm-value">
            {selectedSpecialty?.name || "Not selected"}
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
              ? `${selectedDoctor.price.toLocaleString("vi-VN")} VND`
              : "N/A"}
          </span>
        </div>

        <div className="booking-confirm-note">
          <em>Please bring this booking ticket when going to the appointment.</em>
        </div>
      </div>
    </>
  );
}

function exportBookingTicket({
  patientName,
  symptoms,
  specialty,
  doctor,
  date,
  time,
  price,
}) {
  const note =
    "Please bring this booking ticket when going to the appointment.";
  const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Booking Ticket</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
      .card { border: 1px solid #dbeafe; border-radius: 12px; padding: 20px; background: #f8fbff; max-width: 600px; margin: 0 auto; }
      .title { font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #0f172a; text-align: center; }
      .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
      .label { color: #475569; font-weight: 600; }
      .value { color: #0f172a; font-weight: 600; }
      .price { color: #059669; font-weight: 700; }
      .note { margin-top: 16px; padding: 10px 12px; background: #fff7e6; border: 1px solid #facc15; border-radius: 8px; color: #b45309; font-weight: 600; font-style: italic; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="title">Appointment Booking Ticket</div>
      <div class="row"><span class="label">Patient:</span><span class="value">${patientName || "-"}</span></div>
      <div class="row"><span class="label">Symptoms:</span><span class="value">${symptoms || "Not provided"}</span></div>
      <div class="row"><span class="label">Specialty:</span><span class="value">${specialty || "N/A"}</span></div>
      <div class="row"><span class="label">Doctor:</span><span class="value">${doctor || "N/A"}</span></div>
      <div class="row"><span class="label">Date:</span><span class="value">${date || "N/A"}</span></div>
      <div class="row"><span class="label">Time:</span><span class="value">${time || "N/A"}</span></div>
      <div class="row"><span class="label">Consultation fee:</span><span class="price">${price || "N/A"}</span></div>
      <div class="note">${note}</div>
    </div>
  </body>
</html>
`;

  // Prefer direct download via Blob (avoids popup blockers)
  try {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "booking-ticket.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Download booking ticket failed, fallback to print:", e);
    const newWin = window.open("", "_blank");
    if (!newWin) {
      alert("Please allow popups to download your booking ticket.");
      return;
    }
    newWin.document.write(html);
    newWin.document.close();
    newWin.focus();
    newWin.print();
    newWin.close();
  }
}
