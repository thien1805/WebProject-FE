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
import PatientProfilePage from "./pages/PatientDashboard/components/profile/PatientProfilePage";
import PatientAppointmentsPage from "./pages/PatientDashboard/components/appointments/PatientAppointmentsPage";
import PatientMedicalRecordDetailPage from "./pages/PatientDashboard/components/records/PatientMedicalRecordDetailPage";
// ==== DOCTOR SIDE ====
import DoctorDashboard from "./pages/Doctor-dashboard/DoctorDashboard";
import DoctorPatientList from "./pages/Doctor-dashboard/Doctor-patient/DoctorPatientList";
import DoctorAppointmentLog from "./pages/Doctor-dashboard/Doctor-appointments/DoctorAppointmentLog";
import DoctorCalendar from "./pages/Doctor-dashboard/Doctor-calendar/DoctorCalendar";
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

          {/* Patient side */}
          {/* đường test nhanh vẫn giữ được */}
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/profile" element={<PatientProfilePage />} />
          <Route
            path="/patient/appointments"
            element={<PatientAppointmentsPage />}
              />
          <Route
            path="/patient/medical-record/:recordId"
            element={<PatientMedicalRecordDetailPage />}
          />
          {/* ===== DOCTOR SIDE ===== */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/patients" element={<DoctorPatientList />} />
          <Route
            path="/doctor/appointments"
            element={<DoctorAppointmentLog />}
          />
          <Route path="/doctor/calendar" element={<DoctorCalendar />} />
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
