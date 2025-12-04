// src/pages/Doctor-dashboard/Doctor-appointments/DoctorAppointmentLog.jsx
import React, { useRef } from "react";
import "./DoctorAppointment.css";

import DoctorLayout from "../DoctorLayout";
import AppointmentActivityTable from "./components/AppointmentActivityTable";
import { useDoctorAppointmentList } from "./hooks/useDoctorAppointmentList";
import MedicalRecordQuickAdd from "./components/MedicalRecordQuickAdd";

export default function DoctorAppointmentLog() {
  const hook = useDoctorAppointmentList();
  const recordFormRef = useRef(null);

  const handleAddRecordClick = () => {
    if (recordFormRef.current) {
      recordFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <DoctorLayout activeMenu="appointments">
      <div className="dd-content-card">
        <AppointmentActivityTable {...hook} onAddRecord={handleAddRecordClick} />
        <MedicalRecordQuickAdd ref={recordFormRef} />
      </div>
    </DoctorLayout>
  );
}
