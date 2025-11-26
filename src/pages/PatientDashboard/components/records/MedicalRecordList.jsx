// src/pages/PatientDashboard/components/records/MedicalRecordList.jsx
import React from "react";

const defaultRecords = [
  {
    id: 101,
    date: "01/11/2025",
    doctorName: "Dr. John Smith",
    type: "Consultation",
    summary: "General check-up, normal results.",
  },
  {
    id: 102,
    date: "05/11/2025",
    doctorName: "Dr. Anna Lee",
    type: "Cardiology",
    summary: "Follow-up, adjusted medication dosage.",
  },
  {
    id: 103,
    date: "10/11/2025",
    doctorName: "Dr. David Brown",
    type: "Dermatology",
    summary: "Skin allergy, prescribed topical cream.",
  },
];

export default function MedicalRecordList({ records }) {
  const data = records && records.length ? records : defaultRecords;

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
    </div>
  );
}
