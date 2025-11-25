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
  const data = records || defaultRecords;

  return (
    <div className="pd-card">
      <h3 className="pd-section-title">Medical records</h3>
      <p className="pd-section-subtitle">
        Your visit history and record summaries
      </p>

      <div className="pd-records-list">
        {data.map((rec) => (
          <div key={rec.id} className="pd-record-item">
            <div className="pd-record-main">
              <div className="pd-record-type">{rec.type}</div>
              <div className="pd-record-summary">{rec.summary}</div>
            </div>
            <div className="pd-record-meta">
              <div>📅 {rec.date}</div>
              <div>{rec.doctorName}</div>
              <button type="button" className="pd-outline-btn">
                View details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
