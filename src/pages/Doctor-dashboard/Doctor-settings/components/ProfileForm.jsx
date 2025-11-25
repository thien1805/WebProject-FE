// src/pages/Doctor-dashboard/Doctor-settings/components/ProfileForm.jsx
import React from "react";

export default function ProfileForm({
  formData,
  onChange,
  onSave,
  isEditing,
  onStartEdit,
}) {
  const handleChangeField = (field) => (e) => {
    if (!onChange) return;
    onChange(field, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && onSave) {
      onSave();
    }
  };

  return (
    <form className="settings-card" onSubmit={handleSubmit}>
      <h2 className="settings-title">Doctor Profile</h2>
      <p className="settings-subtitle">
        View and update your personal information.
      </p>

      <div className="settings-grid">
        {/* Full name */}
        <div className="settings-field">
          <label>Full name</label>
          <input
            type="text"
            value={formData.full_name || formData.fullName || ""}
            onChange={handleChangeField("full_name")}
            disabled={!isEditing}
          />
        </div>

        {/* Email */}
        <div className="settings-field">
          <label>Email</label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={handleChangeField("email")}
            disabled={!isEditing}
          />
        </div>

        {/* Phone */}
        <div className="settings-field">
          <label>Phone number</label>
          <input
            type="tel"
            value={formData.phone || formData.phone_number || ""}
            onChange={handleChangeField("phone")}
            disabled={!isEditing}
          />
        </div>

        {/* Specialization */}
        <div className="settings-field">
          <label>Specialization</label>
          <input
            type="text"
            value={formData.specialization || ""}
            onChange={handleChangeField("specialization")}
            disabled={!isEditing}
          />
        </div>

        {/* Experience years */}
        <div className="settings-field">
          <label>Experience (years)</label>
          <input
            type="number"
            min="0"
            value={formData.experience_years || ""}
            onChange={handleChangeField("experience_years")}
            disabled={!isEditing}
          />
        </div>

        {/* Clinic / Workplace */}
        <div className="settings-field">
          <label>Clinic / Workplace</label>
          <input
            type="text"
            value={formData.clinic_name || ""}
            onChange={handleChangeField("clinic_name")}
            disabled={!isEditing}
          />
        </div>

        {/* Address */}
        <div className="settings-field settings-field--full">
          <label>Address</label>
          <input
            type="text"
            value={formData.address || ""}
            onChange={handleChangeField("address")}
            disabled={!isEditing}
          />
        </div>

        {/* About */}
        <div className="settings-field settings-field--full">
          <label>About</label>
          <textarea
            rows={3}
            value={formData.about || ""}
            onChange={handleChangeField("about")}
            disabled={!isEditing}
          />
        </div>

        <div className="settings-field">
          <label>Role</label>
          <input
            type="text"
            value={formData.role || "Doctor"}
            disabled={true}  
          />
        </div>
      </div>

      <div className="settings-actions">
        {!isEditing ? (
          <button
            type="button"
            className="settings-btn settings-btn--primary"
            onClick={onStartEdit}
          >
            Edit profile
          </button>
        ) : (
          <button
            type="submit"
            className="settings-btn settings-btn--primary"
          >
            Save changes
          </button>
        )}
      </div>
    </form>
  );
}
