// src/pages/Doctor-dashboard/components/DashboardHeader.jsx
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../../components/Logo/Logo";
import { useAuth } from "../../../context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();

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
          <Link to="/doctor/dashboard" style={{ display: "inline-flex" }}>
            <Logo clickable={false} />
          </Link>
        </div>

        {/* Right: path + user info */}
        <div className="dd-header-right">
          <span className="dd-header-path">/ Dashboard</span>

          {/* Click vào avatar + tên → sang trang profile settings */}
          <Link
            to="/doctor/settings/profile"
            className="dd-header-account"
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
          </Link>
        </div>
      </div>
    </header>
  );
}
