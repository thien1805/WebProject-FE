// src/pages/PatientDashboard/components/records/MedicalRecordList.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MedicalRecordList({
  appointments = [],
  records = [],
}) {
  // Lọc các lịch đã khám xong (hoặc history)
  const historyAppointments = useMemo(() => {
    if (!Array.isArray(appointments)) return [];
    // Nếu bạn muốn lấy tất cả appointments thì bỏ filter status
    return appointments.filter((a) => a.status === "completed");
  }, [appointments]);

  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState(null);

  // Auto chọn appointment đầu tiên khi có dữ liệu
  useEffect(() => {
    if (historyAppointments.length > 0 && !selectedId) {
      setSelectedId(historyAppointments[0].id);
    }
  }, [historyAppointments, selectedId]);

  const selectedAppt = historyAppointments.find(
    (a) => a.id === selectedId
  );

  // Nếu backend sau này trả records riêng, có thể map theo appointmentId
  const findRecordForAppointment = (appt) => {
    if (!appt) return null;

    // 1. Nếu appointment có sẵn medicalRecord (demo)
    if (appt.medicalRecord) return appt.medicalRecord;

    // 2. Nếu records là mảng có field appointmentId
    if (Array.isArray(records) && records.length > 0) {
      return records.find((r) => r.appointmentId === appt.id) || null;
    }

    return null;
  };

  const selectedRecord = findRecordForAppointment(selectedAppt);

  return (
    <div className="pd-card">
      <h3 className="pd-section-title">My appointments</h3>
      <p className="pd-section-subtitle">
        View your past visits and their medical records.
      </p>

      {historyAppointments.length === 0 ? (
        <div className="pd-empty-tab">
          You don&apos;t have any completed appointments yet.
        </div>
      ) : (
        <div className="pd-history-layout">
          {/* Danh sách appointment bên trái */}
          <div className="pd-history-list">
            {historyAppointments.map((appt) => (
              <button
                key={appt.id}
                type="button"
                className={
                  "pd-history-item" +
                  (appt.id === selectedId ? " pd-history-item--active" : "")
                }
                onClick={() => setSelectedId(appt.id)}
              >
                <div className="pd-history-item-main">
                  <div className="pd-history-doctor">
                    {appt.doctorName}
                  </div>
                  <div className="pd-history-specialty">
                    {appt.specialty}
                  </div>
                </div>
                <div className="pd-history-item-meta">
                  <span>{appt.date}</span>
                  <span>{appt.time}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Medical record của appointment đã chọn */}
          <div className="pd-history-detail">
            {selectedAppt ? (
              <>
                <h4 className="pd-history-detail-title">
                  Medical record
                </h4>
                <div className="pd-history-detail-info">
                  <div>
                    <span className="pd-profile-label">Doctor</span>
                    <div className="pd-profile-value">
                      {selectedAppt.doctorName}
                    </div>
                  </div>
                  <div>
                    <span className="pd-profile-label">Specialty</span>
                    <div className="pd-profile-value">
                      {selectedAppt.specialty}
                    </div>
                  </div>
                  <div>
                    <span className="pd-profile-label">Date</span>
                    <div className="pd-profile-value">
                      {selectedAppt.date} {selectedAppt.time}
                    </div>
                  </div>
                  {selectedAppt.location && (
                    <div>
                      <span className="pd-profile-label">Location</span>
                      <div className="pd-profile-value">
                        {selectedAppt.location}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pd-history-detail-record">
                  <span className="pd-profile-label">Diagnosis</span>
                  <div className="pd-profile-value">
                    {selectedRecord?.diagnosis ||
                      "No diagnosis recorded yet."}
                  </div>

                  <span className="pd-profile-label" style={{ marginTop: 12 }}>
                    Notes / Prescription
                  </span>
                  <div className="pd-profile-value">
                    {selectedRecord?.notes ||
                      "No additional notes recorded."}
                  </div>
                </div>

                <button
                  type="button"
                  className="pd-outline-btn"
                  style={{ alignSelf: "flex-start", marginTop: 8 }}
                  onClick={() =>
                    selectedRecord?.id &&
                    navigate(`/patient/medical-record/${selectedRecord.id}`)
                  }
                  disabled={!selectedRecord?.id}
                >
                  View detail
                </button>
              </>
            ) : (
              <div className="pd-empty-tab">
                Select an appointment on the left to view its record.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
