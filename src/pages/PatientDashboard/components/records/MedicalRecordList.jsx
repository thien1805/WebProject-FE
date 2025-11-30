// src/pages/PatientDashboard/components/records/MedicalRecordList.jsx
import React, { useState } from "react";

const defaultRecords = [
  {
    id: 101,
    date: "01/11/2025",
    time: "09:00",
    doctorName: "Dr. John Smith",
    diagnosis: "General check-up",
    type: "Consultation",
    summary: "General check-up, normal results.",
    price: 300000,
    note: "Patient in good condition. Maintain current lifestyle.",
  },
  {
    id: 102,
    date: "05/11/2025",
    time: "14:30",
    doctorName: "Dr. Anna Lee",
    diagnosis: "Mild arrhythmia",
    type: "Cardiology",
    summary: "Follow-up, adjusted medication dosage.",
    price: 550000,
    note: "Adjusted beta blocker, monitor blood pressure daily.",
  },
  {
    id: 103,
    date: "10/11/2025",
    time: "10:15",
    doctorName: "Dr. David Brown",
    diagnosis: "Skin allergy",
    type: "Dermatology",
    summary: "Skin allergy, prescribed topical cream.",
    price: 420000,
    note: "Apply cream twice daily, avoid direct sunlight.",
  },
];

export default function MedicalRecordList({ records }) {
  const data = records && records.length ? records : defaultRecords;
  const [selected, setSelected] = useState(data[0]);
  const [newNoteMessage, setNewNoteMessage] = useState("");

  const handleView = (rec) => {
    setSelected(rec);
    setNewNoteMessage("");
  };

  const handleSimulateDoctorNote = () => {
    if (!selected) return;
    const updated = {
      ...selected,
      note: `${selected.note || "No note"} (Doctor added a new note at ${
        new Date().toLocaleTimeString("vi-VN")
      })`,
    };
    setSelected(updated);
    setNewNoteMessage("New doctor note received.");
  };

  return (
    <div className="pd-card pd-records-card">
      <div className="pd-records-header">
        <div>
          <h3 className="pd-section-title">Medical records</h3>
          <p className="pd-section-subtitle">
            Your visit history and record summaries
          </p>
        </div>
      </div>

      <div className="pd-records-grid">
        {data.map((rec) => {
          const date =
            rec.visitDate || rec.date || rec.visit_date || "Unknown date";
          const doctor = rec.doctorName || rec.doctor_name || "Doctor";
          const title = rec.type || rec.diagnosis || "Visit summary";
          const summary =
            rec.summary ||
            rec.treatment ||
            rec.notes ||
            "No additional notes available.";

          return (
            <div key={rec.id} className="pd-record-card">
              <div className="pd-record-top">
                <div className="pd-record-chip">{title}</div>
                <span className="pd-record-date">{date}</span>
              </div>

              <div className="pd-record-body">
                <p className="pd-record-text">{summary}</p>
              </div>

              <div className="pd-record-footer">
                <div className="pd-record-doctor">{doctor}</div>
                <button type="button" className="pd-outline-btn">
                  View details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="pd-card" style={{ marginTop: "16px" }}>
          <div className="pd-record-detail-header">
            <div>
              <h3 className="pd-section-title">Appointment details</h3>
              <p className="pd-section-subtitle">
                {selected.date} at {selected.time} — {selected.type}
              </p>
            </div>
            <button
              type="button"
              className="pd-outline-btn"
              onClick={handleSimulateDoctorNote}
            >
              Simulate doctor note
            </button>
          </div>

          {newNoteMessage && (
            <div className="pd-note-alert">{newNoteMessage}</div>
          )}

          <div className="pd-record-detail">
            <p>
              <strong>Doctor:</strong> {selected.doctorName}
            </p>
            <p>
              <strong>Diagnosis:</strong> {selected.diagnosis || selected.type}
            </p>
            <p>
              <strong>Summary:</strong> {selected.summary}
            </p>
            <p>
              <strong>Price:</strong>{" "}
              {selected.price
                ? `${selected.price.toLocaleString("vi-VN")} VND`
                : "N/A"}
            </p>
            <p>
              <strong>Doctor note:</strong> {selected.note || "No note yet."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
