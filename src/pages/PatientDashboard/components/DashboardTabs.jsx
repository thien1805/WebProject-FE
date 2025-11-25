import React from "react";

export default function DashboardTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="pd-tabs-wrapper">
      <div className="pd-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={
              "pd-tab" + (activeTab === tab.id ? " pd-tab--active" : "")
            }
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
