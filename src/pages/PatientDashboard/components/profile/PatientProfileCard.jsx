// src/pages/PatientDashboard/components/profile/PatientProfileCard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { getProfile, updateProfile } from "../../../../api/authAPI";

const EMPTY_PROFILE = {
  name: "",
  email: "",
  phone: "",
  city: "",
  country: "",
};

export default function PatientProfileCard({ initialProfile, startEditing }) {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState(initialProfile || EMPTY_PROFILE);
  const [originalProfile, setOriginalProfile] = useState(
    initialProfile || EMPTY_PROFILE
  );
  const [isEditing, setIsEditing] = useState(!!startEditing);
  const [loading, setLoading] = useState(!initialProfile);
  const [error, setError] = useState(null);

  const normalizeProfile = (data) => ({
    name: data?.full_name || data?.name || "",
    email: data?.email || "",
    phone: data?.phone || "",
    city: data?.city || "",
    country: data?.country || "",
  });

  // Luôn gọi API lấy đúng patient thật từ backend
  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getProfile();
        if (cancelled) return;

        const norm = normalizeProfile(data);
        setProfile(norm);
        setOriginalProfile(norm);

        // Cập nhật AuthContext cho header/avatar
        updateUser?.({
          ...(user || {}),
          name: norm.name,
          fullName: norm.name,
          email: norm.email,
        });
      } catch (err) {
        if (!cancelled) {
          console.error("Load profile error:", err);
          setError(
            typeof err === "string"
              ? err
              : err?.message || "Failed to load profile."
          );
          if (!initialProfile) {
            setProfile(EMPTY_PROFILE);
            setOriginalProfile(EMPTY_PROFILE);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProfile]);

  const initialLetter =
    profile?.name?.charAt(0)?.toUpperCase() ||
    user?.name?.charAt(0)?.toUpperCase() ||
    "?";

  const handleCancelEdit = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  // 👉 chỉ gọi updateProfile, không đụng đến mật khẩu nữa
  const handleSaveProfile = async (updatedProfile) => {
    try {
      const payload = {
        full_name: updatedProfile.name,
        phone: updatedProfile.phone,
        city: updatedProfile.city,
        country: updatedProfile.country,
      };

      const res = await updateProfile(payload);
      const norm = normalizeProfile(res || updatedProfile);

      setProfile(norm);
      setOriginalProfile(norm);

      updateUser?.({
        ...(user || {}),
        name: norm.name,
        fullName: norm.name,
        email: norm.email,
      });

      alert("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      console.error("Update profile error:", err);
      let msg = "Failed to update profile.";
      if (typeof err === "string") msg = err;
      else if (err?.message) msg = err.message;
      else if (err?.detail) msg = err.detail;
      alert(msg);
    }
  };

  if (loading) {
    return (
      <section className="pd-card pd-profile-card">
        <div className="pd-profile-header">
          <div className="pd-profile-main">
            <div className="pd-profile-avatar">
              <span>…</span>
            </div>
            <div>
              <h3 className="pd-profile-name">Loading profile...</h3>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pd-card pd-profile-card">
        <div className="pd-profile-header">
          <div className="pd-profile-main">
            <div className="pd-profile-avatar">
              <span>!</span>
            </div>
            <div>
              <h3 className="pd-profile-name">Profile</h3>
              <p className="pd-profile-email" style={{ color: "red" }}>
                {error}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pd-card pd-profile-card">
      <div className="pd-profile-header">
        <div className="pd-profile-main">
          <div className="pd-profile-avatar">
            <span>{initialLetter}</span>
          </div>
          <div>
            <h3 className="pd-profile-name">{profile?.name || "No name"}</h3>
            <p className="pd-profile-email">
              {profile?.email || "No email provided"}
            </p>
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
            <span className="pd-profile-value">
              {profile.phone || "Not provided"}
            </span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">City</span>
            <span className="pd-profile-value">
              {profile.city || "Not provided"}
            </span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Country</span>
            <span className="pd-profile-value">
              {profile.country || "Not provided"}
            </span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Email</span>
            <span className="pd-profile-value">
              {profile.email || "Not provided"}
            </span>
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
    initialProfile || EMPTY_PROFILE
  );

  useEffect(() => {
    setProfileForm(initialProfile || EMPTY_PROFILE);
  }, [initialProfile]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(profileForm);
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
            disabled
            readOnly
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
