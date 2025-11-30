// src/pages/PatientDashboard/components/records/MedicalRecorDetail.jsx
import React, { useEffect, useState } from "react";
import { getMedicalRecordDetail } from "../../../../api/medicalRecordAPI";

export default function MedicalRecorDetail({ record, recordId }) {
  const [data, setData] = useState(record || null);
  const [loading, setLoading] = useState(!record && !!recordId);
  const [error, setError] = useState(null);

  // Gọi API nếu không có record mà chỉ có recordId
  useEffect(() => {
    if (record || !recordId) return;

    let cancelled = false;

    const fetchRecord = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getMedicalRecordDetail(recordId);
        if (!cancelled) {
          setData(res);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Load medical record detail error:", err);
          setError(
            typeof err === "string"
              ? err
              : err?.message || "Failed to load medical record."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRecord();

    return () => {
      cancelled = true;
    };
  }, [record, recordId]);

  // Fallback demo nếu chưa có dữ liệu API
  const fallback = {
    id: 101,
    date: "2025-11-01",
    doctorName: "Dr. John Smith",
    type: "Consultation",
    summary: "General check-up, normal results.",
    notes:
      "Patient is in good general condition. Suggested to maintain current lifestyle and return for annual check-up.",
  };

  // Chuẩn hoá dữ liệu hiển thị
  const display = {
    id: data?.id ?? fallback.id,
    date: data?.visit_date || data?.date || fallback.date,
    doctorName:
      data?.doctor_name ||
      data?.doctor?.full_name ||
      data?.doctor?.name ||
      fallback.doctorName,
    type: data?.visit_type || data?.type || fallback.type,
    summary:
      data?.summary ||
      data?.diagnosis_summary ||
      data?.chief_complaint ||
      fallback.summary,
    notes:
      data?.notes ||
      data?.clinical_notes ||
      data?.extra_notes ||
      fallback.notes,
    // chỗ để sau này show note từ notification nếu API trả về
    doctorNotificationNote:
      data?.doctor_notification_note ||
      data?.latest_notification?.message ||
      "",
  };

  if (loading) {
    return (
      <div className="pd-card" style={{ marginTop: "16px" }}>
        <h3 className="pd-section-title">Record details</h3>
        <p className="pd-section-subtitle">Loading medical record...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-card" style={{ marginTop: "16px" }}>
        <h3 className="pd-section-title">Record details</h3>
        <p className="pd-section-subtitle" style={{ color: "red" }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="pd-card" style={{ marginTop: "16px" }}>
      <h3 className="pd-section-title">Record details</h3>
      <p className="pd-section-subtitle">
        Visit date: {display.date} — {display.type}
      </p>

      <div className="pd-record-detail">
        <p>
          <strong>Doctor:</strong> {display.doctorName}
        </p>
        <p>
          <strong>Summary:</strong> {display.summary}
        </p>
        <p>
          <strong>Notes:</strong> {display.notes}
        </p>

        {display.doctorNotificationNote && (
          <p>
            <strong>Doctor&apos;s notification:</strong>{" "}
            {display.doctorNotificationNote}
          </p>
        )}
      </div>
    </div>
  );
}
