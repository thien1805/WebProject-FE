// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

// ==== PUBLIC PAGES ====
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import AboutUs from "./pages/AboutUs/AboutUs";
import Medical from "./pages/Medical/Medical";

// ==== PATIENT SIDE ====
import PatientDashboard from "./pages/PatientDashboard/PatientDashboard";

// ==== DOCTOR SIDE - DASHBOARD ROOT ====
import DoctorDashboard from "./pages/Doctor-dashboard/DoctorDashboard";

// ==== DOCTOR SIDE - PATIENTS ====
import DoctorPatientList from "./pages/Doctor-dashboard/Doctor-patient/DoctorPatientList";
import DoctorAddPatient from "./pages/Doctor-dashboard/Doctor-patient/DoctorAddPatient";
import DoctorEditPatient from "./pages/Doctor-dashboard/Doctor-patient/DoctorEditPatient";

// ==== DOCTOR SIDE - APPOINTMENTS ====
import DoctorAppointmentLog from "./pages/Doctor-dashboard/Doctor-appointments/DoctorAppointmentLog";

// ==== DOCTOR SIDE - CALENDAR ====
import DoctorCalendar from "./pages/Doctor-dashboard/Doctor-calendar/DoctorCalendar";

// ==== DOCTOR SIDE - SETTINGS ====
import DoctorProfile from "./pages/Doctor-dashboard/Doctor-settings/DoctorProfile";
import DoctorSettings from "./pages/Doctor-dashboard/Doctor-settings/DoctorSettings";

// Auth context
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ===== PUBLIC / PATIENT ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/medical" element={<Medical />} />

          {/* Patient dashboard (user side) */}
          {/* Đường này dùng để test trực tiếp: http://localhost:5173/dashboard */}
          <Route path="/dashboard" element={<PatientDashboard />} />
          {/* Bạn vẫn có thể giữ thêm /patient/dashboard nếu muốn */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />

          {/* ===== DOCTOR SIDE ===== */}
          {/* Dashboard chính của doctor */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

          {/* Patients */}
          <Route path="/doctor/patients" element={<DoctorPatientList />} />
          <Route path="/doctor/patients/add" element={<DoctorAddPatient />} />
          <Route
            path="/doctor/patients/edit/:id"
            element={<DoctorEditPatient />}
          />

          {/* Appointments */}
          <Route
            path="/doctor/appointments"
            element={<DoctorAppointmentLog />}
          />

          {/* Calendar */}
          <Route path="/doctor/calendar" element={<DoctorCalendar />} />

          {/* Settings */}
          <Route
            path="/doctor/settings/profile"
            element={<DoctorProfile />}
          />
          <Route
            path="/doctor/settings/preferences"
            element={<DoctorSettings />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
