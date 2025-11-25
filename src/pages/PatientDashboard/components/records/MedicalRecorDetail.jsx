// src/pages/PatientDashboard/components/records/MedicalRecorDetail.jsx
import React from "react";

export default function MedicalRecorDetail({ record }) {
  const data =
    record ||
    {
      id: 101,
      date: "01/11/2025",
      doctorName: "Dr. John Smith",
      type: "Consultation",
      summary: "General check-up, normal results.",
      notes:
        "Patient is in good general condition. Suggested to maintain current lifestyle and return for annual check-up.",
    };

  return (
    <div className="pd-card" style={{ marginTop: "16px" }}>
      <h3 className="pd-section-title">Record details</h3>
      <p className="pd-section-subtitle">
        Visit date: {data.date} — {data.type}
      </p>

      <div className="pd-record-detail">
        <p>
          <strong>Doctor:</strong> {data.doctorName}
        </p>
        <p>
          <strong>Summary:</strong> {data.summary}
        </p>
        <p>
          <strong>Notes:</strong> {data.notes}
        </p>
      </div>
    </div>
  );
}
