// src/pages/Doctor-dashboard/DoctorDashboard.jsx
import React from "react";
import "./DoctorDashboard.css";

import { useDoctorDashboard } from "./hooks/useDoctorDashboard";
import DoctorLayout from "./DoctorLayout";

import DashboardHero from "./components/DashboardHero";
import DashboardStatsGrid from "./components/DashboardStatsGrid";
import DashboardActivity from "./components/DashboardActivity";
import DashboardCalendar from "./components/DashboardCalendar";

const DoctorDashboard = () => {
  const { greeting, stats, activity, calendar } = useDoctorDashboard();

  return (
    <DoctorLayout activeMenu="dashboard">
      <div className="dd-layout">
        {/* LEFT COLUMN */}
        <section className="dd-left">
          <DashboardHero greeting={greeting} />
          <div className="dd-bottom-row">
            <DashboardActivity activity={activity} />
            <DashboardStatsGrid stats={stats} />
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <section className="dd-right">
          <DashboardCalendar calendar={calendar} />
        </section>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;
