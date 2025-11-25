import React from "react";

export default function DashboardStats({ stats }) {
  return (
    <div className="pd-stats-grid">
      {stats.map((item) => (
        <div
          key={item.id}
          className={
            "pd-stat-card" + (item.highlight ? " pd-stat-card--highlight" : "")
          }
        >
          <div className="pd-stat-label">{item.label}</div>
          <div className="pd-stat-value-wrapper">
            <span
              className={
                "pd-stat-value" + (item.highlight ? " pd-stat-value--green" : "")
              }
            >
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
