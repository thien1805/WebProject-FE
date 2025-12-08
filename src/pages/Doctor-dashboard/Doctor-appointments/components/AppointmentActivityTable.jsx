// src/pages/Doctor-dashboard/Doctor-appointments/components/AppointmentActivityTable.jsx
import React from "react";

export default function AppointmentActivityTable({
  rows,
  loading,
  error,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  statusChoices,
  updateStatus,
  onAddRecord,
  toast,
}) {
  const renderStatusLabel = (value) => {
    const found = statusChoices.find((s) => s.value === value);
    return found ? found.label : value;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    // If HH:MM:SS format, remove seconds
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) return timeStr.slice(0, 5);
    return timeStr;
  };

  const handleStatusChange = async (id, newStatus) => {
    const result = await updateStatus(id, newStatus);
    if (result.success) {
      toast?.success?.(`Status updated to ${renderStatusLabel(newStatus)}`);
    } else {
      toast?.error?.(result.error || "Failed to update status");
    }
  };

  return (
    <div className="appt-card">
      {/* HEADER + FILTERS */}
      <div className="appt-header-row">
        <div>
          <h2 className="appt-title">Appointments</h2>
          <p className="appt-subtitle">
            Search and update your patients&apos; appointment status.
          </p>
        </div>

        <div className="appt-header-right">
          {/* search patient */}
          <div className="appt-search-input">
            <span role="img" aria-label="search">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search patient…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* status pills */}
      <div className="appt-status-filter">
        <button
          type="button"
          className={
            "appt-status-pill" +
            (statusFilter === "all" ? " appt-status-pill--active" : "")
          }
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>

        {statusChoices.map((st) => (
          <button
            key={st.value}
            type="button"
            className={
              "appt-status-pill" +
              (statusFilter === st.value ? " appt-status-pill--active" : "")
            }
            onClick={() => setStatusFilter(st.value)}
          >
            {renderStatusLabel(st.value)}
          </button>
        ))}
      </div>

      {/* date filter */}
      <div className="appt-filter-bar">
        <div className="appt-filter-item">
          <span className="appt-filter-label">Date</span>
          <input
            type="date"
            className="appt-date-input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="appt-reset-btn"
          onClick={() => {
            setSearch("");
            setStatusFilter("all");
            setDateFilter("");
          }}
        >
          Reset filter
        </button>
      </div>

      {/* Loading / Error states */}
      {loading && (
        <div className="appt-loading">Loading appointments...</div>
      )}
      
      {error && (
        <div className="appt-error">{error}</div>
      )}

      {/* TABLE */}
      {!loading && !error && (
        <div className="appt-table-wrapper">
          <table className="appt-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Status</th>
                <th>Department</th>
                <th>Notes</th>
                <th>Time</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="appt-empty">
                    No appointments found.
                  </td>
                </tr>
              )}

              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="appt-patient-cell">
                    <div className="appt-avatar">
                      {row.patient.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="appt-patient-name">{row.patient}</div>
                      {row.patientEmail && (
                        <div className="appt-patient-email">{row.patientEmail}</div>
                      )}
                    </div>
                  </td>

                  {/* STATUS: select có thể đổi trạng thái */}
                  <td>
                    <select
                      className={`appt-status-select appt-status-select--${row.status}`}
                      value={row.status}
                      onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    >
                      {statusChoices.map((st) => (
                        <option key={st.value} value={st.value}>
                          {st.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>{row.department?.name || "N/A"}</td>
                  <td>{row.notes || "-"}</td>
                  <td>{formatTime(row.time)}</td>
                  <td>{formatDate(row.date)}</td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className={
                        "appt-record-btn" +
                        (row.status === "completed" || row.status === "confirmed"
                          ? ""
                          : " appt-record-btn--disabled")
                      }
                      disabled={row.status !== "completed" && row.status !== "confirmed"}
                      onClick={() => {
                        if (row.status !== "completed" && row.status !== "confirmed") return;
                        onAddRecord?.(row._raw || row);
                      }}
                    >
                      {row.medicalRecord ? "View Record" : "Add Record"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
