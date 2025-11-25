import React from "react";
import AppointmentStatusBadge from "./AppointmentStatusBadge";

export default function AppointmentItem({ appt }) {
  return (
    <div className="pd-appointment-item">
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

      <div className="pd-appointment-middle">
        <div className="pd-appointment-date">📅 {appt.date}</div>
        <div className="pd-appointment-time">🕒 {appt.time}</div>
      </div>

      <div className="pd-appointment-right">
        <AppointmentStatusBadge status={appt.status} />
        <button type="button" className="pd-outline-btn">
          Details
        </button>
      </div>
    </div>
  );
}
