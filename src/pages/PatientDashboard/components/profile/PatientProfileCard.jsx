// src/pages/PatientDashboard/components/profile/PatientProfileCard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";

const defaultProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+84 123 456 789",
  city: "Ho Chi Minh City",
  country: "Viet Nam",
};

export default function PatientProfileCard({ initialProfile, startEditing }) {
  const { user, updateUser } = useAuth();

  const buildInitial = () => ({
    name:
      user?.fullName ||
      user?.name ||
      initialProfile?.name ||
      defaultProfile.name,
    email: user?.email || initialProfile?.email || defaultProfile.email,
    phone: initialProfile?.phone || defaultProfile.phone,
    city: initialProfile?.city || defaultProfile.city,
    country: initialProfile?.country || defaultProfile.country,
  });

  const [profile, setProfile] = useState(buildInitial);
  const [isEditing, setIsEditing] = useState(!!startEditing);

  useEffect(() => {
    setProfile(buildInitial());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, initialProfile]);

  useEffect(() => {
    setIsEditing(!!startEditing);
  }, [startEditing]);

  const initialLetter = profile.name?.charAt(0)?.toUpperCase() || "?";

  const handleCancelEdit = () => {
    setProfile(buildInitial());
    setIsEditing(false);
  };

  const handleSaveProfile = (updatedProfile, passwordPayload) => {
    setProfile(updatedProfile);

    // TODO: integrate API update for profile + password
    console.log("Save profile:", updatedProfile);
    if (passwordPayload) {
      console.log("Change password:", passwordPayload);
    }

    updateUser({
      ...(user || {}),
      name: updatedProfile.name,
      fullName: updatedProfile.name,
      email: updatedProfile.email,
    });

    alert("Profile saved (demo only).");
    setIsEditing(false);
  };

  return (
    <section className="pd-card pd-profile-card">
      <div className="pd-profile-header">
        <div className="pd-profile-main">
          <div className="pd-profile-avatar">
            <span>{initialLetter}</span>
          </div>
          <div>
            <h3 className="pd-profile-name">{profile.name}</h3>
            <p className="pd-profile-email">{profile.email}</p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            className="pd-outline-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit profile
          </button>
        )}
      </div>

      {!isEditing && (
        <div className="pd-profile-info-grid">
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Phone</span>
            <span className="pd-profile-value">{profile.phone}</span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">City</span>
            <span className="pd-profile-value">{profile.city}</span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Country</span>
            <span className="pd-profile-value">{profile.country}</span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Email</span>
            <span className="pd-profile-value">{profile.email}</span>
          </div>
        </div>
      )}

      {isEditing && (
        <PatientProfileForm
          initialProfile={profile}
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
        />
      )}
    </section>
  );
}

function PatientProfileForm({ initialProfile, onSave, onCancel }) {
  const [profileForm, setProfileForm] = useState(
    initialProfile || defaultProfile
  );
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setProfileForm(initialProfile || defaultProfile);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [initialProfile]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    const hasAnyPassword =
      currentPassword.trim() || newPassword.trim() || confirmPassword.trim();

    if (hasAnyPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Please fill in all password fields.");
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("New password and confirmation do not match.");
        return;
      }
    }

    onSave(profileForm, hasAnyPassword ? passwordForm : null);
  };

  return (
    <form className="pd-profile-form" onSubmit={handleSubmit}>
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
        <button type="button" className="pd-ghost-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="pd-primary-btn">
          Save changes
        </button>
      </div>
    </form>
  );
}
