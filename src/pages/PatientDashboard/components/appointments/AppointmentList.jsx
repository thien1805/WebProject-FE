import React from "react";
import AppointmentItem from "./AppointmentItem";
import AppointmentStatusFilter from "./AppointmentStatusFilter";

export default function AppointmentList({
  appointments,
  records = [],
  statusOptions,
  activeStatus,
  onStatusChange,
}) {
  const filtered =
    activeStatus === "all"
      ? appointments
      : (appointments || []).filter((a) => a.status === activeStatus);

  return (
    <div className="pd-card pd-appointments-card">
      <h3 className="pd-section-title">Appointments</h3>
      <p className="pd-section-subtitle">Your appointments by status</p>

      <AppointmentStatusFilter
        statusOptions={statusOptions}
        activeStatus={activeStatus}
        onChange={onStatusChange}
      />

      {filtered.length === 0 ? (
        <div className="pd-empty-tab">
          You don&apos;t have any completed appointments yet.
        </div>
      ) : (
        <div className="pd-appointments-list">
          {filtered.map((appt) => {
            const recordForAppt =
              records.find((r) => r.appointmentId === appt.id) || null;
            return (
              <AppointmentItem
                key={appt.id}
                appt={appt}
                recordId={recordForAppt?.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
