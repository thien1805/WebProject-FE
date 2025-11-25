// src/pages/Doctor-dashboard/Doctor-settings/DoctorSettings.jsx
import React from "react";
import "./DoctorSettings.css";

import DoctorLayout from "../DoctorLayout";
import { useDoctorSettings } from "./hooks/useDoctorSettings";

export default function DoctorSettings() {
  const {
    hud,
    toggleHud,
    currency,
    setCurrency,
    timezone,
    setTimezone,
    handleSave,
  } = useDoctorSettings();

  return (
    <DoctorLayout activeMenu="settings" activeSub="settings">
      <div className="settings-layout">
        <SettingsHUD
          hud={hud}
          toggleHud={toggleHud}
          timezone={timezone}
          setTimezone={setTimezone}
          onSave={handleSave}
        />
      </div>
    </DoctorLayout>
  );
}
