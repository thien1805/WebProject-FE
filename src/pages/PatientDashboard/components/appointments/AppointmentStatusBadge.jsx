import React from "react";

const STATUS_CONFIG = {
  confirmed: { label: "Confirmed", className: "pd-status--confirmed" },
  pending: { label: "Pending", className: "pd-status--pending" },
  completed: { label: "Completed", className: "pd-status--completed" },
  cancelled: { label: "Cancelled", className: "pd-status--cancelled" },
};

export default function AppointmentStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, className: "" };

  return <span className={`pd-status-badge ${cfg.className}`}>{cfg.label}</span>;
}
