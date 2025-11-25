// src/pages/Doctor-dashboard/DoctorLayout.jsx
import React from "react";
import DoctorSidebar from "../../components/DoctorSidebar/DoctorSidebar";
import DashboardHeader from "./components/DashboardHeader";
import "./DoctorDashboard.css"; // dùng chung các class .doctor-layout, .dd-page, .dd-main,...

export default function DoctorLayout({ activeMenu, activeSub, children }) {
  return (
    <div className="doctor-layout">
      {/* Sidebar bên trái (cố định) */}
      <DoctorSidebar activeMenu={activeMenu} activeSub={activeSub} />

      {/* Phần nền xanh + header giống Dashboard */}
      <div className="dd-page">
        <DashboardHeader />

        <main className="dd-main">
          {children}
        </main>
      </div>
    </div>
  );
}
