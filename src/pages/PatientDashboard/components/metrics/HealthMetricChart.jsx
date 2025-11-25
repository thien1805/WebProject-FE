// src/pages/PatientDashboard/components/metrics/HealthMetricChart.jsx
import React from "react";

const defaultPoints = [
  { label: "Jul", value: 40 },
  { label: "Aug", value: 55 },
  { label: "Sep", value: 65 },
  { label: "Oct", value: 80 },
  { label: "Nov", value: 60 },
  { label: "Dec", value: 75 },
];

export default function HealthMetricChart({ points }) {
  const data = points || defaultPoints;

  return (
    <div className="pd-card" style={{ marginTop: "16px" }}>
      <h3 className="pd-section-title">Health progress</h3>
      <p className="pd-section-subtitle">
        Simple trend of your overall health score
      </p>

      <div className="pd-chart-wrapper">
        {data.map((p) => (
          <div key={p.label} className="pd-chart-column">
            <div
              className="pd-chart-bar"
              style={{ height: `${p.value + 20}px` }}
            />
            <div className="pd-chart-label">{p.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
