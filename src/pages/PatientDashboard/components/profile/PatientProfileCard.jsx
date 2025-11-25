// src/pages/PatientDashboard/components/profile/PatientProfileCard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext"; // chỉnh path nếu cần


const defaultProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+84 123 456 789",
  city: "Ho Chi Minh City",
  country: "Viet Nam",
};

export default function PatientProfileCard({ initialProfile }) {
  const { user, updateUser } = useAuth();

  // lấy dữ liệu ban đầu: ưu tiên user → initialProfile → default
  const buildInitial = () => ({
    name: user?.fullName || user?.name || initialProfile?.name || defaultProfile.name,
    email: user?.email || initialProfile?.email || defaultProfile.email,
    phone: initialProfile?.phone || defaultProfile.phone,
    city: initialProfile?.city || defaultProfile.city,
    country: initialProfile?.country || defaultProfile.country,
  });

  const [profile, setProfile] = useState(buildInitial);
  const [isEditing, setIsEditing] = useState(false);

  // nếu user / initialProfile đổi (ví dụ sau này load từ API) thì sync lại
  useEffect(() => {
    setProfile(buildInitial());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, initialProfile]);

  const initialLetter = profile.name?.charAt(0)?.toUpperCase() || "?";

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setProfile(buildInitial());
    setIsEditing(false);
  };

  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    // TODO: sau này call API update profile ở đây
    console.log("Save profile:", updatedProfile);

    // cập nhật tạm vào AuthContext để header hiển thị tên mới
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
      {/* phần info / avatar luôn nằm trong card */}
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
      </div>

      {!isEditing && (
        <>
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
          </div>

          {/* 👉 nút Edit nằm DƯỚI card */}
          <div className="pd-profile-actions">
            <button
              type="button"
              className="pd-outline-btn"
              onClick={handleEditClick}
            >
              Edit profile
            </button>
          </div>
        </>
      )}

      {/* EDIT MODE: hiện form bên trong card */}
      {isEditing && (
        <>
          <PatientProfileForm
            initialProfile={profile}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />
        </>
      )}
    </section>
  );
}
