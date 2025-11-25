import { useState } from "react";

export function useDoctorProfile() {
  const [formData, setFormData] = useState({
    name: "Ahmed Zaid Elsayed",
    email: "ah7s_123@gmail.com",
    currentPassword: "***************",
    newPassword: "",
    dob: "25 January 1990",
    role: "Admin",
    country: "Egypt",
    city: "Alexandria",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: gọi API thật sau này
    console.log("Profile data:", formData);
    alert("Saved profile (demo)");
  };

  return { formData, handleChange, handleSave };
}
