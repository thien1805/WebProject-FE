import React from "react";
import { useNavigate } from "react-router-dom";
import AppointmentStatusBadge from "./AppointmentStatusBadge";

const STATUS_LABELS = {
  booked: "Pending", // map booked -> Pending
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function AppointmentItem({ appt, recordId }) {
  const navigate = useNavigate();

  const handleViewRecord = () => {
    if (!recordId) return;
    navigate(`/patient/medical-record/${recordId}`);
  };

  const statusLabel =
    STATUS_LABELS[appt.status?.toLowerCase?.()] || appt.status || "Unknown";

  return (
    <div className="pd-appointment-card">
      <div className="pd-appointment-left">
        <div className="pd-avatar-circle">
          <span>{appt.doctorName.charAt(0)}</span>
        </div>
        <div>
          <div className="pd-doc-name">{appt.doctorName}</div>
          <div className="pd-doc-specialty">{appt.specialty}</div>
          {appt.location && <div className="pd-location">{appt.location}</div>}
        </div>
      </div>

      <div className="pd-appointment-info">
        <div className="pd-appointment-meta">
          <span className="pd-appointment-label">Date</span>
          <span className="pd-appointment-value">{appt.date}</span>
        </div>
        <div className="pd-appointment-meta">
          <span className="pd-appointment-label">Time</span>
          <span className="pd-appointment-value">{appt.time}</span>
        </div>
      </div>

      <div className="pd-appointment-actions">
        <button
          type="button"
          className="pd-status-chip"
          disabled
          aria-label={`Status: ${statusLabel}`}
        >
          {statusLabel}
        </button>
        <button
          type="button"
          className="pd-outline-btn"
          onClick={handleViewRecord}
          disabled={!recordId}
          title={recordId ? "View medical record" : "No record available"}
        >
          View detail
        </button>
      </div>
    </div>
  );
}
