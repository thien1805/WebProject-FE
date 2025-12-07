import React, { useState } from "react";
import AppointmentItem from "./AppointmentItem";
import AppointmentStatusFilter from "./AppointmentStatusFilter";
import { cancelAppointment } from "../../../../api/appointmentAPI";

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
  toast,
  onRefresh,
}) {
  const [cancellingId, setCancellingId] = useState(null);

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

  const handleCancelAppointment = async (appointmentId, reason = "Cancelled by patient") => {
    if (!appointmentId) return;
    
    setCancellingId(appointmentId);
    try {
      const result = await cancelAppointment(appointmentId, reason);
      
      if (result?.success) {
        toast?.success(result.message || "Appointment cancelled successfully!", 4000);
        // Refresh the appointments list
        if (onRefresh) onRefresh();
      } else {
        toast?.error(result?.error || result?.message || "Failed to cancel appointment", 5000);
      }
    } catch (err) {
      console.error("Cancel appointment error:", err);
      // Extract error message from backend response
      const errorMessage = 
        err?.message || 
        err?.error || 
        err?.detail ||
        (typeof err === 'string' ? err : "Failed to cancel appointment. Please try again.");
      toast?.error(errorMessage, 5000);
    } finally {
      setCancellingId(null);
    }
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
          {activeStatus === "all" 
            ? "You don't have any appointments yet."
            : `No ${activeStatus} appointments found.`}
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
                onCancel={handleCancelAppointment}
                isCancelling={cancellingId === appt.id}
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
