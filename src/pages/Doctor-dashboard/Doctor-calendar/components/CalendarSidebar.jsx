// src/pages/Doctor-dashboard/Doctor-calendar/components/CalendarSidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function CalendarSidebar() {
  const navigate = useNavigate();

  const handleGoToApproved = () => {
    // Điều hướng tới trang Appointments, kèm query status=approved
    navigate("/doctor/appointments?status=approved");
  };

  return (
    <aside className="cal-sidebar">
      <h2 className="cal-sidebar-title">Calendar</h2>
      <button
        type="button"
        className="cal-add-btn"
        onClick={handleGoToApproved}
      >
        View approved appointments
      </button>
    </aside>
  );

}
