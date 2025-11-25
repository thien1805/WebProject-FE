// src/pages/PatientDashboard/components/metrics/HealthMetricsSummary.jsx
import React from "react";

const defaultMetrics = {
  bmi: { value: 22.3, status: "Normal" },
  bloodPressure: { value: "118 / 76", status: "Normal" },
  heartRate: { value: 72, status: "Normal" },
};

export default function HealthMetricsSummary({ metrics }) {
  const data = metrics || defaultMetrics;
  const { bmi, bloodPressure, heartRate } = data;

  return (
    <div className="pd-card">
      <h3 className="pd-section-title">Health metrics</h3>
      <p className="pd-section-subtitle">
        Key indicators from your latest check-ups
      </p>

      <div className="pd-metrics-grid">
        <div className="pd-metric-card">
          <div className="pd-metric-label">BMI</div>
          <div className="pd-metric-value">{bmi.value}</div>
          <div className="pd-metric-status">{bmi.status}</div>
        </div>

        <div className="pd-metric-card">
          <div className="pd-metric-label">Blood pressure</div>
          <div className="pd-metric-value">{bloodPressure.value}</div>
          <div className="pd-metric-status">{bloodPressure.status}</div>
        </div>

        <div className="pd-metric-card">
          <div className="pd-metric-label">Heart rate</div>
          <div className="pd-metric-value">{heartRate.value} bpm</div>
          <div className="pd-metric-status">{heartRate.status}</div>
        </div>
      </div>
    </div>
  );
}
