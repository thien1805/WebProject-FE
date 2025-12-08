// src/components/DoctorSidebar/DoctorSidebar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./DoctorSidebar.css";
import Logo from "../Logo/Logo";
import { useAuth } from "../../context/AuthContext";

export default function DoctorSidebar({ activeMenu, activeSub }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  const getItemClass = (menuId) =>
    "nav-item" + (activeMenu === menuId ? " nav-item--active" : "");

  const getSubItemClass = (subId) =>
    "nav-sub-item" + (activeSub === subId ? " nav-sub-item--active" : "");

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setConfirmLogoutOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="doctor-sidebar">
      {/* Logo (nếu muốn hiện lại thì bỏ comment) */}
      {/* <div className="doctor-sidebar-logo">
        <Logo />
      </div> */}
      <br />
      <br />
      <br />

      {/* Main menu */}
      <nav className="doctor-sidebar-nav">
        {/* Dashboard */}
        <Link to="/doctor/dashboard" className={getItemClass("dashboard")}>
          <span className="nav-icon">🏠</span>
          <span>Dashboard</span>
        </Link>

        {/* Transactions + submenu */}
        <div>
          {/* Nếu sau này muốn show item Transactions chính thì mở lại block bên dưới
          <Link
            to="/doctor/bill-list"
            className={getItemClass("transactions")}
          >
            <span className="nav-icon">💳</span>
            <span>Transactions</span>
          </Link>
          */}

          {activeMenu === "transactions" && (
            <div className="nav-sub">
              <Link
                to="/doctor/bill-list"
                className={getSubItemClass("bill-list")}
              >
                Bill list
              </Link>
              <Link
                to="/doctor/add-bill"
                className={getSubItemClass("add-bill")}
              >
                Add bill
              </Link>
              <Link
                to="/doctor/invoice"
                className={getSubItemClass("invoice")}
              >
                Invoice
              </Link>
            </div>
          )}
        </div>

        {/* Appointments */}
        <Link
          to="/doctor/appointments"
          className={getItemClass("appointments")}
        >
          <span className="nav-icon">📅</span>
          <span>Appointments</span>
        </Link>

        {/* Calendar */}
        <Link to="/doctor/calendar" className={getItemClass("calendar")}>
          <span className="nav-icon">📆</span>
          <span>Calendar</span>
        </Link>
      </nav>
      {/* Bottom section: settings + logout */}
      <div className="doctor-sidebar-bottom">
        <Link
          to="/doctor/settings/profile"
          className={getItemClass("settings")}
        >
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </Link>

        <button
          type="button"
          className="nav-item"
          onClick={() => setConfirmLogoutOpen(true)}
        >
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>

      {confirmLogoutOpen && (
        <div
          className="header-modal-backdrop"
          onClick={() => setConfirmLogoutOpen(false)}
        >
          <div
            className="header-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
          >
            <div className="header-modal-title" id="logout-modal-title">
              Are you sure to log out?
            </div>
            <div className="header-modal-actions">
              <button
                type="button"
                className="header-modal-btn header-modal-btn--secondary"
                onClick={() => setConfirmLogoutOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="header-modal-btn header-modal-btn--danger"
                onClick={handleLogoutConfirm}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
