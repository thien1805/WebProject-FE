// src/Doctor/components/DashboardStatsGrid.jsx
import React from "react";

export default function DashboardStatsGrid({ stats }) {
  return (
    <div className="dd-stats-grid">
      {stats.map((item) => (
        <div className="dd-stat-card" key={item.id}>
          <div className="dd-stat-label">{item.label}</div>
          <div className="dd-stat-value">{item.value}</div>
          <div className="dd-stat-footer dd-stat-footer-up">
            <span className="dd-stat-subtext">
              appointments in this month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
