// src/pages/PatientDashboard/components/records/MedicalRecordList.jsx
import React, { useEffect, useState } from "react";
import { getMedicalRecords } from "../../../../api/medicalRecordAPI";
import MedicalRecorDetail from "./MedicalRecorDetail";

/**
 * 📌 GHI CHÚ VỀ API:
 *
 * ✅ ĐANG DÙNG:
 *   - getMedicalRecords() trong medicalRecordAPI.js
 *   - Tương ứng endpoint backend: GET /api/v1/medical-records/
 *     (endpoint này bạn đã có trong bộ API gửi cho tớ – API LIST hồ sơ bệnh án).
 *
 * ❌ CHƯA DÙNG / CHƯA CÓ:
 *   - Không còn dữ liệu default (John Smith, Anna Lee, ...).
 *   - Không còn "Simulate doctor note" (demo).
 *   - Nếu sau này muốn lấy "doctor note mới nhất" từ notification,
 *     cần backend embed vào record detail hoặc làm Notification API riêng.
 */

export default function MedicalRecordList({ records }) {
  const [list, setList] = useState(records || []);
  const [selected, setSelected] = useState(
    records && records.length ? records[0] : null
  );
  const [loading, setLoading] = useState(!records);
  const [error, setError] = useState(null);

  // Nếu parent không truyền records → tự gọi API GET /medical-records/
  useEffect(() => {
    // Nếu đã được truyền records từ ngoài, chỉ sync lại state
    if (records && records.length) {
      setList(records);
      setSelected(records[0]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔔 Dùng API LIST medical records hiện có:
        //    GET /api/v1/medical-records/
        //    Backend có thể tự hiểu patient từ access_token,
        //    hoặc bạn có thể chỉnh getMedicalRecords({ patientId }) nếu cần.
        const data = await getMedicalRecords();
        const items = data?.results || data || [];

        if (!cancelled) {
          setList(items);
          setSelected(items[0] || null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Load medical records error:", err);
          setError(
            typeof err === "string"
              ? err
              : err?.message || "Failed to load medical records."
          );
          setList([]);
          setSelected(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRecords();

    return () => {
      cancelled = true;
    };
  }, [records]);

  const handleView = (rec) => {
    setSelected(rec);
  };

  if (loading) {
    return (
      <div className="pd-card pd-records-card">
        <div className="pd-records-header">
          <div>
            <h3 className="pd-section-title">Medical records</h3>
            <p className="pd-section-subtitle">
              Your visit history and record summaries
            </p>
          </div>
        </div>
        <div className="pd-empty-tab">Loading your medical records...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-card pd-records-card">
        <div className="pd-records-header">
          <div>
            <h3 className="pd-section-title">Medical records</h3>
            <p className="pd-section-subtitle">
              Your visit history and record summaries
            </p>
          </div>
        </div>
        <div className="pd-empty-tab" style={{ color: "red" }}>
          {error}
        </div>
      </div>
    );
  }

  if (!list.length) {
    return (
      <div className="pd-card pd-records-card">
        <div className="pd-records-header">
          <div>
            <h3 className="pd-section-title">Medical records</h3>
            <p className="pd-section-subtitle">
              Your visit history and record summaries
            </p>
          </div>
        </div>
        <div className="pd-empty-tab">
          You don&apos;t have any medical records yet.
        </div>
      </div>
    );
  }

  return (
    <div className="pd-card pd-records-card">
      <div className="pd-records-header">
        <div>
          <h3 className="pd-section-title">Medical records</h3>
          <p className="pd-section-subtitle">
            Your visit history and record summaries
          </p>
        </div>
      </div>

      <div className="pd-records-grid">
        {list.map((rec) => {
          const date =
            rec.visitDate || rec.date || rec.visit_date || "Unknown date";
          const doctor =
            rec.doctorName ||
            rec.doctor_name ||
            rec.doctor?.full_name ||
            "Doctor";
          const title = rec.type || rec.diagnosis || "Visit summary";
          const summary =
            rec.summary ||
            rec.treatment ||
            rec.notes ||
            "No additional notes available.";

          return (
            <div key={rec.id} className="pd-record-card">
              <div className="pd-record-top">
                <div className="pd-record-chip">{title}</div>
                <span className="pd-record-date">{date}</span>
              </div>

              <div className="pd-record-body">
                <p className="pd-record-text">{summary}</p>
              </div>

              <div className="pd-record-footer">
                <div className="pd-record-doctor">{doctor}</div>
                <button
                  type="button"
                  className="pd-outline-btn"
                  onClick={() => handleView(rec)}
                >
                  View details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <MedicalRecorDetail record={selected} />
      )}
    </div>
  );
}
