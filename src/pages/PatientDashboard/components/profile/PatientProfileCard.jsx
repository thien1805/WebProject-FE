// src/pages/PatientDashboard/components/profile/PatientProfileCard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { getProfile, updateProfile } from "../../../../api/authAPI";

const EMPTY_PROFILE = {
  name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  gender: "",
  address: "",
  insurance_id: "",
  emergency_contact: "",
  emergency_contact_phone: "",
};

export default function PatientProfileCard({ user, initialProfile, startEditing }) {
  const { updateUser } = useAuth();

  const [profile, setProfile] = useState(initialProfile || EMPTY_PROFILE);
  const [originalProfile, setOriginalProfile] = useState(
    initialProfile || EMPTY_PROFILE
  );
  const [isEditing, setIsEditing] = useState(!!startEditing);
  const [loading, setLoading] = useState(!initialProfile && !user);
  const [error, setError] = useState(null);

  const normalizeProfile = (data) => ({
    name: data?.full_name || "",
    email: data?.email || "",
    phone: data?.phone_num || "",
    date_of_birth: data?.patient_profile?.date_of_birth || "",
    gender: data?.patient_profile?.gender || "",
    address: data?.patient_profile?.address || "",
    insurance_id: data?.patient_profile?.insurance_id || "",
    emergency_contact: data?.patient_profile?.emergency_contact || "",
    emergency_contact_phone: data?.patient_profile?.emergency_contact_phone || "",
  });

  // Nếu nhận được user từ props, sử dụng luôn
  useEffect(() => {
    if (user) {
      const norm = normalizeProfile(user);
      setProfile(norm);
      setOriginalProfile(norm);
      setLoading(false);
      return;
    }

    // Nếu không có user từ props, gọi API
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

  const handleSaveProfile = async (updatedProfile) => {
    try {
      const payload = {
        full_name: updatedProfile.name,
        email: updatedProfile.email,
        phone_num: updatedProfile.phone,
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
                {typeof error === "string" && error.includes("<")
                  ? "Failed to load profile."
                  : error}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pd-card pd-profile-card" style={{ minHeight: "auto", width: "100%" }}>
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
        <div className="pd-profile-info-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "30px" }}>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Full Name</span>
            <span className="pd-profile-value">
              {profile.name || "Not provided"}
            </span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Email</span>
            <span className="pd-profile-value">
              {profile.email || "Not provided"}
            </span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Phone</span>
            <span className="pd-profile-value">
              {profile.phone || "Not provided"}
            </span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Date of Birth</span>
            <span className="pd-profile-value">
              {profile.date_of_birth || "Not provided"}
            </span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Gender</span>
            <span className="pd-profile-value" style={{ textTransform: "capitalize" }}>
              {profile.gender || "Not provided"}
            </span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Insurance ID</span>
            <span className="pd-profile-value">
              {profile.insurance_id || "Not provided"}
            </span>
          </div>
          <div className="pd-profile-info-item" style={{ gridColumn: "1 / -1" }}>
            <span className="pd-profile-label">Address</span>
            <span className="pd-profile-value">
              {profile.address || "Not provided"}
            </span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Emergency Contact</span>
            <span className="pd-profile-value">
              {profile.emergency_contact || "Not provided"}
            </span>
          </div>
          <div className="pd-profile-info-item">
            <span className="pd-profile-label">Emergency Contact Phone</span>
            <span className="pd-profile-value">
              {profile.emergency_contact_phone || "Not provided"}
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setProfileForm(initialProfile || EMPTY_PROFILE);
    setErrors({});
  }, [initialProfile]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    
    // Validate email in real-time
    if (name === "email" && value && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email before submit
    if (profileForm.email && !validateEmail(profileForm.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }
    
    onSave(profileForm);
  };

  return (
    <form className="pd-profile-form" onSubmit={handleSubmit}>
      <div className="pd-profile-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div className="pd-profile-form-field">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={profileForm.name}
            onChange={handleProfileChange}
            required
          />
        </div>
        <div className="pd-profile-form-field">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={profileForm.email}
            onChange={handleProfileChange}
            required
            style={{ borderColor: errors.email ? "red" : "inherit" }}
          />
          {errors.email && <span style={{ color: "red", fontSize: "12px" }}>{errors.email}</span>}
        </div>
      </div>

      <div className="pd-profile-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div className="pd-profile-form-field">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={profileForm.phone}
            onChange={handleProfileChange}
          />
        </div>
        <div className="pd-profile-form-field">
          <label>Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={profileForm.date_of_birth}
            onChange={handleProfileChange}
          />
        </div>
      </div>

      <div className="pd-profile-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div className="pd-profile-form-field">
          <label>Gender</label>
          <select
            name="gender"
            value={profileForm.gender}
            onChange={handleProfileChange}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="pd-profile-form-field">
          <label>Insurance ID</label>
          <input
            type="text"
            name="insurance_id"
            value={profileForm.insurance_id}
            onChange={handleProfileChange}
          />
        </div>
      </div>

      <div className="pd-profile-form-row" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
        <div className="pd-profile-form-field">
          <label>Address</label>
          <textarea
            name="address"
            value={profileForm.address}
            onChange={handleProfileChange}
            rows="3"
            style={{ resize: "vertical" }}
          />
        </div>
      </div>

      <div className="pd-profile-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div className="pd-profile-form-field">
          <label>Emergency Contact Name</label>
          <input
            type="text"
            name="emergency_contact"
            value={profileForm.emergency_contact}
            onChange={handleProfileChange}
          />
        </div>
        <div className="pd-profile-form-field">
          <label>Emergency Contact Phone</label>
          <input
            type="text"
            name="emergency_contact_phone"
            value={profileForm.emergency_contact_phone}
            onChange={handleProfileChange}
          />
        </div>
        <div className="pd-profile-form-field">
          <label>Role</label>
          <input type="text" value="Patient" disabled readOnly />
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
