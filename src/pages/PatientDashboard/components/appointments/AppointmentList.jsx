import React from "react";
import AppointmentItem from "./AppointmentItem";
import AppointmentStatusFilter from "./AppointmentStatusFilter";

export default function AppointmentList({
  appointments,
  statusOptions,
  activeStatus,
  onStatusChange,
}) {
  const filtered =
    activeStatus === "all"
      ? appointments
      : appointments.filter((a) => a.status === activeStatus);

  return (
    <div className="pd-card">
      <h3 className="pd-section-title">Upcoming appointments</h3>
      <p className="pd-section-subtitle">
        Your upcoming doctor appointments
      </p>

      <AppointmentStatusFilter
        statusOptions={statusOptions}
        activeStatus={activeStatus}
        onChange={onStatusChange}
      />

      {filtered.length === 0 ? (
        <div className="pd-empty-tab">
          There are no appointments with this status.
        </div>
      ) : (
        filtered.map((appt) => <AppointmentItem key={appt.id} appt={appt} />)
      )}
    </div>
  );
}
