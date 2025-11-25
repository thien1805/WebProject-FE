// src/pages/PatientDashboard/components/profile/PatientProfileForm.jsx
import React, { useState } from "react";

const defaultProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+84 123 456 789",
  city: "Ho Chi Minh City",
  country: "Viet Nam",
};

export default function PatientProfileForm({ initialProfile }) {
  const [form, setForm] = useState(initialProfile || defaultProfile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // later you can call API here
    console.log("Save profile:", form);
    alert("Profile saved (demo only).");
  };

  return (
    <div className="pd-card" style={{ marginTop: "16px" }}>
      <h3 className="pd-section-title">Edit profile</h3>

      <form className="pd-profile-form" onSubmit={handleSubmit}>
        <div className="pd-profile-form-row">
          <div className="pd-profile-form-field">
            <label>Full name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="pd-profile-form-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="pd-profile-form-row">
          <div className="pd-profile-form-field">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="pd-profile-form-field">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="pd-profile-form-row">
          <div className="pd-profile-form-field">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="pd-primary-btn">
          Save changes
        </button>
      </form>
    </div>
  );
}
