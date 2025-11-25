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

  const role =
    user?.role || user?.accountType || user?.userType || "patient";

  const isPatient = role === "patient";
  const isDoctor = role === "doctor";

  const dashboardPath = isDoctor
    ? "/doctor/dashboard"
    : "/patient/dashboard";

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleBookingClick = (e) => {
    e.preventDefault();

    if (!isAuth) {
      navigate("/login");
      return;
    }

    if (isPatient) {
      navigate("/patient/appointments");
    } else if (isDoctor) {
      navigate("/doctor/dashboard");
    } else {
      navigate("/");
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

            {/* Booking */}
            <Link
              to={
                !isAuth
                  ? "/login"
                  : isPatient
                  ? "/patient/appointments"
                  : "/doctor/dashboard"
              }
              className="nav-link"
              onClick={handleBookingClick}
            >
              Booking
            </Link>

          </nav>

          {/* Auth / Account */}
          <div className="header-actions">
            {/* CHƯA login: Log in + Sign up */}
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

            {/* ĐÃ login */}
            {isAuth && (
               <div className="header-account">
              {/* 👉 Nút Patient Account / Doctor Dashboard với viền pastel */}
              {/* <Link to={dashboardPath} className="patient-account-btn">
              {isDoctor ? "Doctor Dashboard" : "Patient Account"}
              </Link> */}

                {/* Avatar + dropdown */}
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
                      {/* <Link
                        to={dashboardPath}
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {isDoctor ? "Doctor dashboard" : "Patient dashboard"}
                      </Link> */}
                                            {isPatient && (
                        <button type="button"
                          className="dropdown-item"
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate("/patient/dashboard?tab=profile");
                          }}
                        >
                          View profile
                        </button>
                      )}

                      {isPatient && (
                        <Link
                          to="/patient/appointments"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Book appointment
                        </Link>
                      )}

                      {isDoctor && (
                        <Link
                          to="/doctor/dashboard"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          View schedule
                        </Link>
                      )}

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
