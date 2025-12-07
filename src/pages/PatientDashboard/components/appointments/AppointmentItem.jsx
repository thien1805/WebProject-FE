import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_LABELS = {
  booked: "Pending",
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS = {
  pending: "pd-status--pending",
  booked: "pd-status--pending",
  confirmed: "pd-status--confirmed",
  completed: "pd-status--completed",
  cancelled: "pd-status--cancelled",
};

export default function AppointmentItem({ appt, recordId, onCancel, isCancelling }) {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleViewRecord = () => {
    if (!recordId) return;
    navigate(`/patient/medical-record/${recordId}`);
  };

  const status = appt.status?.toLowerCase?.() || "pending";
  const statusLabel = STATUS_LABELS[status] || appt.status || "Unknown";
  const statusColor = STATUS_COLORS[status] || "";

  // Can only cancel pending or confirmed appointments
  const canCancel = ["pending", "confirmed", "booked"].includes(status);

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (onCancel) {
      onCancel(appt.id, cancelReason || "Cancelled by patient");
    }
    setShowCancelModal(false);
    setCancelReason("");
  };

  const handleCloseModal = () => {
    setShowCancelModal(false);
    setCancelReason("");
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Format time for display
  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    // If already in HH:MM format, return as is
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
    // If HH:MM:SS format, remove seconds
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) return timeStr.slice(0, 5);
    return timeStr;
  };

  return (
    <>
      <div className={`pd-appointment-card ${status === 'cancelled' ? 'pd-appointment-card--cancelled' : ''}`}>
        <div className="pd-appointment-left">
          <div className="pd-avatar-circle">
            <span>{appt.doctorName?.charAt(0) || "?"}</span>
          </div>
          <div>
            <div className="pd-doc-name">{appt.doctorName || "Unknown Doctor"}</div>
            <div className="pd-doc-specialty">{appt.specialty || "General"}</div>
            {appt.location && <div className="pd-location">📍 {appt.location}</div>}
          </div>
        </div>

        <div className="pd-appointment-info">
          <div className="pd-appointment-meta">
            <span className="pd-appointment-label">📅 Date</span>
            <span className="pd-appointment-value">{formatDate(appt.date)}</span>
          </div>
          <div className="pd-appointment-meta">
            <span className="pd-appointment-label">🕐 Time</span>
            <span className="pd-appointment-value">{formatTime(appt.time)}</span>
          </div>
        </div>

        <div className="pd-appointment-actions">
          <span className={`pd-status-badge ${statusColor}`}>
            {statusLabel}
          </span>
          
          <div className="pd-action-buttons">
            {canCancel && (
              <button
                type="button"
                className="pd-cancel-btn"
                onClick={handleCancelClick}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling..." : "Cancel"}
              </button>
            )}
            
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
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="pd-modal-overlay" onClick={handleCloseModal}>
          <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="pd-modal-title">Cancel Appointment</h3>
            <p className="pd-modal-text">
              Are you sure you want to cancel this appointment with <strong>{appt.doctorName}</strong> on <strong>{formatDate(appt.date)}</strong> at <strong>{formatTime(appt.time)}</strong>?
            </p>
            
            <label className="pd-modal-label">
              Reason for cancellation (optional):
            </label>
            <textarea
              className="pd-modal-textarea"
              placeholder="Enter your reason..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />

            <div className="pd-modal-actions">
              <button
                type="button"
                className="pd-secondary-btn"
                onClick={handleCloseModal}
              >
                Keep Appointment
              </button>
              <button
                type="button"
                className="pd-danger-btn"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
