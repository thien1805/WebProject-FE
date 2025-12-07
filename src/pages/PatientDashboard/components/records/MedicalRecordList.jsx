// src/pages/PatientDashboard/components/records/MedicalRecordList.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../../hooks/useTranslation";

export default function MedicalRecordList({
  appointments = [],
  records = [],
}) {
  const { t } = useTranslation();
  
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
      <h3 className="pd-section-title">{t("patient.myAppointments")}</h3>
      <p className="pd-section-subtitle">
        {t("patient.viewPastVisits")}
      </p>

      {historyAppointments.length === 0 ? (
        <div className="pd-empty-tab">
          {t("patient.noCompletedVisits")}
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
                  {t("patient.medicalRecords")}
                </h4>
                <div className="pd-history-detail-info">
                  <div>
                    <span className="pd-profile-label">{t("patient.doctor")}</span>
                    <div className="pd-profile-value">
                      {selectedAppt.doctorName}
                    </div>
                  </div>
                  <div>
                    <span className="pd-profile-label">{t("patient.specialty")}</span>
                    <div className="pd-profile-value">
                      {selectedAppt.specialty}
                    </div>
                  </div>
                  <div>
                    <span className="pd-profile-label">{t("patient.date")}</span>
                    <div className="pd-profile-value">
                      {selectedAppt.date} {selectedAppt.time}
                    </div>
                  </div>
                  {selectedAppt.location && (
                    <div>
                      <span className="pd-profile-label">{t("patient.location")}</span>
                      <div className="pd-profile-value">
                        {selectedAppt.location}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pd-history-detail-record">
                  <span className="pd-profile-label">{t("patient.diagnosis")}</span>
                  <div className="pd-profile-value">
                    {selectedRecord?.diagnosis ||
                      t("patient.noDiagnosis")}
                  </div>

                  <span className="pd-profile-label" style={{ marginTop: 12 }}>
                    {t("patient.notesPrescription")}
                  </span>
                  <div className="pd-profile-value">
                    {selectedRecord?.notes ||
                      t("patient.noNotes")}
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
                  {t("patient.viewDetail")}
                </button>
              </>
            ) : (
              <div className="pd-empty-tab">
                {t("patient.selectAppointmentToView")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
