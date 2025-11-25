import React from "react";

export default function AppointmentStatusFilter({
  statusOptions,
  activeStatus,
  onChange,
}) {
  return (
    <div className="pd-status-filter">
      {statusOptions.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={
            "pd-status-filter-pill" +
            (activeStatus === opt.id ? " pd-status-filter-pill--active" : "")
          }
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
