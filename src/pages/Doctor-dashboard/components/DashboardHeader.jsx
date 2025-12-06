// src/pages/Doctor-dashboard/components/DashboardHeader.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../../components/Logo/Logo";
import { useAuth } from "../../../context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // Lấy tên hiển thị từ user
  const displayName = user?.fullName || user?.name || "Doctor";
  const initial = displayName.charAt(0).toUpperCase();

  // Nếu backend có avatarUrl thì dùng, không thì dùng chữ cái đầu
  const avatarUrl = user?.avatarUrl || user?.avatar || null;

  return (
    <header className="dd-header">
      <div className="dd-header-inner">
        {/* Left: logo */}
        <div className="dd-header-left dd-header-left--logo">
          <Logo to="/doctor/dashboard" />
        </div>

        {/* Right: path + user info */}
        <div className="dd-header-right">
          <span className="dd-header-path">/ Dashboard</span>

          <button
            type="button"
            className="dd-header-account"
            onClick={() => setOpen((prev) => !prev)}
          >
            <div className="dd-header-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} />
              ) : (
                <span>{initial}</span>
              )}
            </div>
            <div className="dd-header-user-text">
              <span className="dd-header-user-name">{displayName}</span>
              <span className="dd-header-user-role">Doctor</span>
            </div>
          </button>

          {open && (
            <div className="dd-header-dropdown">
              <Link
                to="/doctor/appointments"
                className="dd-header-dropdown-item"
                onClick={() => setOpen(false)}
              >
                View appointments
              </Link>
              <Link
                to="/doctor/settings/profile"
                className="dd-header-dropdown-item"
                onClick={() => setOpen(false)}
              >
                View profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
