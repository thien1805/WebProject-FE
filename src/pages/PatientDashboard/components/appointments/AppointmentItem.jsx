import React from "react";
import AppointmentStatusBadge from "./AppointmentStatusBadge";

export default function AppointmentItem({ appt }) {
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
        <AppointmentStatusBadge status={appt.status} />
        <button type="button" className="pd-outline-btn">
          Details
        </button>
      </div>
    </div>
  );
}
