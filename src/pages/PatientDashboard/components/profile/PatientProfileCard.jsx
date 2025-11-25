// src/pages/PatientDashboard/components/profile/PatientProfileCard.jsx
import React from "react";

const defaultProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+84 123 456 789",
  dateOfBirth: "25 January 1995",
  city: "Ho Chi Minh City",
  country: "Viet Nam",
};

export default function PatientProfileCard({ profile }) {
  const data = profile || defaultProfile;

  return (
    <div className="pd-card">
      <h3 className="pd-section-title">Profile</h3>
      <p className="pd-section-subtitle">
        Basic information about your account
      </p>

      <div className="pd-profile-header">
        <div className="pd-hero-avatar">
          <div className="pd-hero-avatar-inner">
            {data.name.charAt(0)}
          </div>
        </div>
        <div>
          <div className="pd-doc-name">{data.name}</div>
          <div className="pd-doc-specialty">{data.email}</div>
          <div className="pd-location">{data.phone}</div>
        </div>
      </div>

      <div className="pd-profile-grid">
        <div>
          <div className="pd-profile-label">Date of birth</div>
          <div className="pd-profile-value">{data.dateOfBirth}</div>
        </div>
        <div>
          <div className="pd-profile-label">City</div>
          <div className="pd-profile-value">{data.city}</div>
        </div>
        <div>
          <div className="pd-profile-label">Country</div>
          <div className="pd-profile-value">{data.country}</div>
        </div>
      </div>
    </div>
  );
}
