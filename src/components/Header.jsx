// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Bell } from "lucide-react";
import Logo from "./Logo/Logo";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { useTranslation } from "../hooks/useTranslation";
import LanguageSwitcher from "./LanguageSwitcher/LanguageSwitcher";
import { getPatientNotifications, markAllNotificationsRead } from "../api/notificationAPI";
import "./Header.css";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  // 🔔 State cho notifications
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState(null);

  const { user, isAuth, logout } = useAuth();
  const { success: showSuccess } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const displayName = user?.full_name || "Null User";
  const initial = displayName.charAt(0).toUpperCase();

  const role = user?.role || user?.accountType || user?.userType || "patient";
  const isPatient = role === "patient";
  const isDoctor = role === "doctor";

  const dashboardPath = isDoctor ? "/doctor/dashboard" : "/patient/dashboard";

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      setConfirmLogoutOpen(false);
      showSuccess("Logged out successfully!");
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleOpenLogoutConfirm = () => {
    setConfirmLogoutOpen(true);
    setDropdownOpen(false);
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

  // ================== 🔔 Notifications: Fetch from API ==================
  useEffect(() => {
    if (!isAuth || !isPatient) {
      setNotifications([]);
      return;
    }

    let cancelled = false;

    const fetchNotifications = async () => {
      try {
        setNotifLoading(true);
        setNotifError(null);

        const response = await getPatientNotifications();
        
        if (!cancelled) {
          if (response.error) {
            setNotifError(response.error);
            setNotifications([]);
          } else {
            setNotifications(response.results || []);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Load notifications error:", err);
          setNotifError(t("notifications.loadError") || "Failed to load notifications");
        }
      } finally {
        if (!cancelled) {
          setNotifLoading(false);
        }
      }
    };

    fetchNotifications();
    
    // Refresh notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isAuth, isPatient, t]);
  // =====================================================

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = async () => {
    // Cập nhật UI ngay
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

    // Gọi API để sync backend
    try {
      await markAllNotificationsRead();
    } catch (err) {
      console.error("Mark all notifications read error:", err);
    }
  };

  const handleToggleNotif = () => {
    setNotifOpen((prev) => !prev);
    setDropdownOpen(false);
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
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              {t('common.home')}
            </Link>
            <Link to="/about" className="nav-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              {t('common.aboutUs')}
            </Link>
            <Link to="/medical" className="nav-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              {t('common.medicalServices')}
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
              onClick={() => {
                handleBookingClick();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {t('common.booking')}
            </Link>
          </nav>

          {/* Auth / Account */}
          <div className="header-actions">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {!isAuth && (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  {t('common.login')}
                </Link>
                <Link to="/signup" className="btn-signup" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  {t('common.signup')}
                </Link>
              </div>
            )}

            {isAuth && (
              <div className="header-account">
                {isPatient && (
                  <div className="notif-wrapper">
                    <button
                      type="button"
                      className="notif-button"
                      onClick={handleToggleNotif}
                    >
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className="notif-badge">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>

                    {notifOpen && (
                      <div className="notif-dropdown">
                        <div className="notif-header">
                          <span>{t('notifications.title') || t('header.notifications')}</span>
                          {!notifLoading && notifications.length > 0 && unreadCount > 0 && (
                            <button
                              type="button"
                              className="notif-clear"
                              onClick={handleMarkAllRead}
                            >
                              {t('notifications.markAllRead') || 'Mark all read'}
                            </button>
                          )}
                        </div>

                        {notifLoading && (
                          <div className="notif-empty">{t('common.loading')}</div>
                        )}

                        {notifError && !notifLoading && (
                          <div className="notif-empty notif-error">
                            {notifError}
                          </div>
                        )}

                        {!notifLoading &&
                          !notifError &&
                          notifications.length === 0 && (
                            <div className="notif-empty">
                              {t('notifications.noNotifications') || 'No notifications yet'}
                            </div>
                          )}

                        {!notifLoading &&
                          !notifError &&
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className={
                                "notif-item" +
                                (n.unread ? " notif-item--unread" : "")
                              }
                            >
                              <div className="notif-title">{n.title}</div>
                              <div className="notif-message">{n.message}</div>
                              <div className="notif-time">{n.time}</div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}

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
                      {isPatient && (
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate("/patient/dashboard?tab=profile");
                          }}
                        >
                          {t('common.profile')}
                        </button>
                      )}

                      {isPatient && (
                        <Link
                          to="/patient/appointments"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {t('common.booking')}
                        </Link>
                      )}

                      {isDoctor && (
                        <Link
                          to="/doctor/dashboard"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {t('common.dashboard')}
                        </Link>
                      )}

                      <button
                        type="button"
                        className="dropdown-item dropdown-item--danger"
                        onClick={handleOpenLogoutConfirm}
                      >
                        {t('common.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {confirmLogoutOpen && (
        <div className="header-modal-backdrop" onClick={() => setConfirmLogoutOpen(false)}>
          <div
            className="header-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
          >
            <div className="header-modal-title" id="logout-modal-title">
              {t('auth.confirmLogout')}
            </div>
            <div className="header-modal-actions">
              <button
                type="button"
                className="header-modal-btn header-modal-btn--secondary"
                onClick={() => setConfirmLogoutOpen(false)}
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                className="header-modal-btn header-modal-btn--danger"
                onClick={handleLogoutConfirm}
              >
                {t('common.logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
