// src/pages/PatientDashboard/PatientDashboard.jsx
import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useSearchParams, useNavigate } from "react-router-dom";

import "./PatientDashboard.css";
import { usePatientDashboard } from "./hooks/usePatientDashboard";

// top-level widgets
import DashboardStats from "./components/DashboardStats";
import DashboardTabs from "./components/DashboardTabs";

// tab: appointments
import AppointmentList from "./components/appointments/AppointmentList";

// tab: profile
import PatientProfileCard from "./components/profile/PatientProfileCard";

// tab: records
import MedicalRecordList from "./components/records/MedicalRecordList";

export default function PatientDashboard() {
  // 🔹 TẤT CẢ HOOK PHẢI Ở ĐÂY
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    user,
    stats,
    tabs,
    appointments,
    records,
    statusOptions,
    activeTab,
    setActiveTab,
    activeStatus,
    setActiveStatus,
    loading,
    error,
  } = usePatientDashboard();

  // 🔹 sync tab với ?tab=profile / appointments / ...
  React.useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, setActiveTab]);

  // 🔹 sau khi gọi hook MỚI được if/return
  if (loading && !user) {
    return (
      <>
        <Header />
        <main className="pd-page">
          <div className="pd-card pd-empty-tab">Loading dashboard…</div>
        </main>
      </>
    );
  }

  if (!loading && !user) {
    return (
      <>
        <Header />
        <main className="pd-page">
          <div className="pd-card pd-empty-tab">
            {error || "Cannot load patient dashboard."}
          </div>
        </main>
      </>
    );
  }

  const initialLetter = user?.name?.charAt(0)?.toUpperCase() ?? "?";

  const handleHeroBookClick = () => {
    navigate("/patient/appointments");
  };

  return (
    <>
      <Header />

      <main className="pd-page">
        {/* HERO */}
        <section className="pd-hero-card">
          <div className="pd-hero-left">
            <div className="pd-hero-avatar">
              <div className="pd-hero-avatar-inner">{initialLetter}</div>
            </div>
            <div>
              <h1 className="pd-hero-title">Hello, {user.name}!</h1>
              <p className="pd-hero-subtitle">
                Welcome to the MyHealthCare patient portal.
              </p>
            </div>
          </div>

          <div className="pd-hero-right">
            <button
              type="button"
              className="pd-primary-btn"
              onClick={handleHeroBookClick}
            >
              📅 Book a new appointment
            </button>
          </div>
        </section>

        {/* nếu đang dùng dữ liệu demo vì API lỗi: */}
        {error && (
          <div className="pd-card pd-empty-tab" style={{ marginTop: 0 }}>
            {error}
          </div>
        )}

        {/* STATS */}
        <DashboardStats stats={stats} />

        {/* TABS */}
        <DashboardTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* TAB CONTENT */}
        {activeTab === "appointments" && (
          <AppointmentList
            appointments={appointments}
            records={records}
            statusOptions={statusOptions}
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
          />
        )}

        {activeTab === "records" && <MedicalRecordList 
        records={records}
        appointments={appointments} />}

        {activeTab === "profile" && (
          <PatientProfileCard user={user} />
        )}
      </main>

      <Footer />
    </>
  );
}
