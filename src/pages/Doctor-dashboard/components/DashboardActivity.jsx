import React from "react";

export default function DashboardActivity({ activity }) {
  return (
    <div className="dd-activity-card">
      <div className="dd-card-header">
        <h3>Recent Activity</h3>
      </div>
      <div className="dd-activity-chart">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
          <polyline
            points="0,30 10,25 20,28 30,15 40,10 50,25 60,20 70,30 80,18 90,22 100,14"
            fill="none"
            strokeWidth="2"
            className="dd-chart-line"
          />
          <line
            x1="0"
            y1="30"
            x2="100"
            y2="30"
            className="dd-chart-axis"
          />
        </svg>
        <div className="dd-chart-labels">
          {activity.labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
