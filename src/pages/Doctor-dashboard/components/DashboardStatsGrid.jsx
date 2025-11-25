// src/Doctor/components/DashboardStatsGrid.jsx
import React from "react";

export default function DashboardStatsGrid({ stats }) {
  return (
    <div className="dd-stats-grid">
      {stats.map((item) => (
        <div className="dd-stat-card" key={item.id}>
          <div className="dd-stat-label">{item.label}</div>
          <div className="dd-stat-value">{item.value}</div>
          <div
            className={
              "dd-stat-footer " +
              (item.trendDirection === "up"
                ? "dd-stat-footer-up"
                : "dd-stat-footer-down")
            }
          >
            <span>{item.trend}</span>
            <span>{item.trendText}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
