// src/pages/PatientDashboard/components/profile/PatientProfileCard.jsx
import React, { useState } from "react";

const defaultProfile = {
  name: "John Doe",
  email: "johndoe@example.com",
  phone: "+84 123 456 789",
  city: "Ho Chi Minh City",
  country: "Viet Nam",
};

export default function PatientProfileCard({ user }) {
  const initialProfile = {
    name: user?.name || user?.fullName || defaultProfile.name,
    email: user?.email || defaultProfile.email,
    phone: user?.phone || defaultProfile.phone,
    city: user?.city || defaultProfile.city,
    country: user?.country || defaultProfile.country,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState(initialProfile);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const initialLetter =
    (profileForm.name || "P").charAt(0).toUpperCase() ?? "P";

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setProfileForm(initialProfile);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple password validation (demo)
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Please fill in all password fields.");
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("New password and confirmation do not match.");
        return;
      }
    }

    // TODO: call API to save profile + password
    console.log("Save profile (demo):", profileForm);
    console.log("Change password (demo):", passwordForm);

    alert("Profile updated (demo only).");

    setIsEditing(false);
  };

  /* ===== VIEW MODE ===== */
  if (!isEditing) {
    return (
      <section className="pd-profile-card">
        <div className="pd-profile-header">
          <div className="pd-profile-main">
            <div className="pd-profile-avatar">{initialLetter}</div>
            <div>
              <h3 className="pd-profile-name">{profileForm.name}</h3>
              <p className="pd-profile-email">{profileForm.email}</p>
            </div>
          </div>

          <button
            type="button"
            className="pd-outline-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit profile
          </button>
        </div>

        <div className="pd-profile-info-grid">
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Phone</span>
            <span className="pd-profile-value">{profileForm.phone}</span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">City</span>
            <span className="pd-profile-value">{profileForm.city}</span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Country</span>
            <span className="pd-profile-value">{profileForm.country}</span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Email</span>
            <span className="pd-profile-value">{profileForm.email}</span>
          </div>
        </div>
      </section>
    );
  }

  /* ===== EDIT MODE ===== */
  return (
    <section className="pd-profile-card">
      <div className="pd-profile-header">
        <div className="pd-profile-main">
          <div className="pd-profile-avatar">{initialLetter}</div>
          <div>
            <h3 className="pd-profile-name">Edit profile</h3>
            <p className="pd-profile-email">
              Update your personal information and password.
            </p>
          </div>
        </div>
      </div>

      <form className="pd-profile-form" onSubmit={handleSubmit}>
        {/* Basic info */}
        <div className="pd-profile-form-row">
          <div className="pd-profile-form-field">
            <label>Full name</label>
            <input
              type="text"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
            />
          </div>
          <div className="pd-profile-form-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
            />
          </div>
        </div>

        <div className="pd-profile-form-row">
          <div className="pd-profile-form-field">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={profileForm.phone}
              onChange={handleProfileChange}
            />
          </div>
          <div className="pd-profile-form-field">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={profileForm.city}
              onChange={handleProfileChange}
            />
          </div>
        </div>

        <div className="pd-profile-form-row">
          <div className="pd-profile-form-field">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={profileForm.country}
              onChange={handleProfileChange}
            />
          </div>
        </div>

        {/* Password section */}
        <h4 className="pd-profile-subsection-title">Change password</h4>

        <div className="pd-profile-form-row">
          <div className="pd-profile-form-field">
            <label>Current password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="pd-profile-form-field">
            <label>New password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
            />
          </div>
        </div>

        <div className="pd-profile-form-row">
          <div className="pd-profile-form-field">
            <label>Confirm new password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>
        </div>

        <div className="pd-profile-actions">
          <button
            type="button"
            className="pd-ghost-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button type="submit" className="pd-primary-btn">
            Save changes
          </button>
        </div>
      </form>
    </section>
  );
}
