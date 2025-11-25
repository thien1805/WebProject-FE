// src/pages/Doctor-dashboard/Doctor-appointments/DoctorAppointmentLog.jsx
import React from "react";
import "./DoctorAppointment.css";

import DoctorLayout from "../DoctorLayout";
import AppointmentActivityTable from "./components/AppointmentActivityTable";
import { useDoctorAppointmentList } from "./hooks/useDoctorAppointmentList";

export default function DoctorAppointmentLog() {
  const hook = useDoctorAppointmentList();

  return (
    <DoctorLayout activeMenu="appointments">
      <div className="dd-content-card">
        <AppointmentActivityTable {...hook} />
      </div>
    </DoctorLayout>
  );
}
