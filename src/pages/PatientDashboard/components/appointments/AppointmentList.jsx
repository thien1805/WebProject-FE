import React from "react";
import AppointmentItem from "./AppointmentItem";
import AppointmentStatusFilter from "./AppointmentStatusFilter";

export default function AppointmentList({
  appointments,
  records = [],
  statusOptions,
  activeStatus,
  onStatusChange,
  page = 1,
  pageSize = 5,
  total = 0,
  onPageChange,
}) {
  const filtered =
    activeStatus === "all"
      ? appointments
      : (appointments || []).filter((a) => a.status === activeStatus);

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  const handlePrev = () => {
    if (page > 1 && onPageChange) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages && onPageChange) onPageChange(page + 1);
  };

  const startIdx = (page - 1) * pageSize + 1;
  const endIdx = Math.min(total, page * pageSize);

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

      {totalPages > 1 && (
        <div className="pd-pagination">
          <button
            type="button"
            className="pd-secondary-btn"
            onClick={handlePrev}
            disabled={page <= 1}
          >
            ← Previous
          </button>
          <div className="pd-pagination-meta">
            Page {page} of {totalPages} · Showing {startIdx}-{endIdx} of {total}
          </div>
          <button
            type="button"
            className="pd-secondary-btn"
            onClick={handleNext}
            disabled={page >= totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
