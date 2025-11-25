import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Logo from "./Logo/Logo";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuth, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.fullName || user?.name || "Account";
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Khi bấm menu "Booking" trên thanh nav
  const handleBookingClick = (e) => {
    e.preventDefault();
    if (isAuth) {
      navigate("/dashboard"); // đã login → vào dashboard
    } else {
      navigate("/login"); // chưa login → vào login
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <Logo />

          {/* Navigation */}
          <nav className="nav-menu">
            <Link
              to="/"
              className="nav-link"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
            >
              Home
            </Link>
            <Link to="/about" className="nav-link">
              About us
            </Link>
            <Link to="/medical" className="nav-link">
              Medical services
            </Link>

            {/* Booking: đổi hướng theo trạng thái đăng nhập */}
            <Link
              to={isAuth ? "/dashboard" : "/login"}
              className="nav-link"
              onClick={handleBookingClick}
            >
              Booking
            </Link>
          </nav>

          {/* Search & Auth / Account */}
          <div className="header-actions">
            {/* Nếu CHƯA login: hiện Log in + Sign up như cũ */}
            {!isAuth && (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">
                  Log in
                </Link>
                <Link to="/signup" className="btn-signup">
                  Sign up
                </Link>
              </div>
            )}

            {/* Nếu ĐÃ login: hiện Dashboard + menu tài khoản */}
            {isAuth && (
              <div className="header-account">
                <Link to="/dashboard" className="btn-login">
                  Dashboard
                </Link>

                <div className="account-menu">
                  <button
                    type="button"
                    className="account-toggle"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    <span className="account-avatar">{initial}</span>
                    <span className="account-name">{displayName}</span>
                    <ChevronDown size={16} />
                  </button>

                  {dropdownOpen && (
                    <div className="account-dropdown">
                      <Link
                        to="/dashboard"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/booking"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Book appointment
                      </Link>
                      <button
                        type="button"
                        className="dropdown-item dropdown-item--danger"
                        onClick={handleLogout}
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
