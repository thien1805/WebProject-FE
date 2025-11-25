// src/pages/PatientDashboard/hooks/usePatientDashboard.js
import { useState, useEffect } from "react";
import {
  getMyProfile,
  getMyAppointments,
  getMyMedicalRecords,
  getMyHealthTracking,
} from "../../../api/patientAPI";

// --- demo data fallback khi API lỗi / chưa có backend ---
function buildDemoData() {
  const user = {
    id: 1,
    userId: 1,
    name: "Nguyen Van A",
    email: "23521111@gm.uit.edu.vn",
    phone: "+84 987 654 321",
    birthDate: "1990-01-15",
    address: "123 ABC Street, District 1, Ho Chi Minh City",
    gender: "Male",
  };

  const appointments = [
    {
      id: 1,
      date: "2025-11-15",
      time: "10:00",
      status: "confirmed",
      notes: "General checkup – flu, medication prescribed",
      doctorId: 2,
      doctorName: "Dr. Nguyen Van Nam",
      specialty: "Internal Medicine",
      location: "MyHealthCare Clinic, Branch 1",
    },
    {
      id: 2,
      date: "2025-11-20",
      time: "14:30",
      status: "booked",
      notes: "Pediatric consultation",
      doctorId: 3,
      doctorName: "Dr. Tran Thi Lan",
      specialty: "Pediatrics",
      location: "MyHealthCare Clinic, Branch 1",
    },
    {
      id: 3,
      date: "2025-11-10",
      time: "09:00",
      status: "completed",
      notes: "Heart checkup",
      doctorId: 4,
      doctorName: "Dr. Le Minh Tuan",
      specialty: "Cardiology",
      location: "MyHealthCare Clinic, Branch 2",
    },
  ];

  const records = [
    {
      id: 1,
      appointmentId: 3,
      doctorId: 4,
      patientId: 1,
      diagnosis: "General good health, mild hypertension",
      treatment: "Lifestyle advice, follow-up in 6 months",
      notes: "No severe issues detected.",
      visitDate: "2025-11-10",
    },
    {
      id: 2,
      appointmentId: 1,
      doctorId: 2,
      patientId: 1,
      diagnosis: "Seasonal flu",
      treatment: "Antiviral medication + rest",
      notes: "Responding well to treatment.",
      visitDate: "2025-11-05",
    },
  ];

  const metrics = {
    blood_pressure: {
      value: "120/80",
      unit: "mmHg",
      measuredAt: "2025-11-05T09:00:00",
      notes: "Normal",
    },
    heart_rate: {
      value: "72",
      unit: "bpm",
      measuredAt: "2025-11-05T09:00:00",
      notes: "Normal resting HR",
    },
    weight: {
      value: "68",
      unit: "kg",
      measuredAt: "2025-11-05T09:00:00",
      notes: "",
    },
    height: {
      value: "170",
      unit: "cm",
      measuredAt: "2025-11-05T09:00:00",
      notes: "",
    },
  };

  // stats dùng chung format với UI
  const upcomingCount = appointments.filter((a) =>
    ["booked", "confirmed"].includes(a.status)
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "completed"
  ).length;
  const medicalRecordCount = records.length;

  const stats = [
    {
      id: "upcoming",
      label: "Upcoming appointments",
      value: upcomingCount,
      icon: "📅",
    },
    {
      id: "records",
      label: "Medical records",
      value: medicalRecordCount,
      icon: "📄",
    },
    {
      id: "visited",
      label: "Completed visits",
      value: completedCount,
      icon: "✅",
    },
    {
      id: "health",
      label: "Health status",
      value: "Good",
      icon: "📈",
      highlight: true,
    },
  ];

  return { user, appointments, records, metrics, stats };
}

export function usePatientDashboard() {
  const [activeTab, setActiveTab] = useState("appointments");

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filter trạng thái lịch hẹn
  const [activeStatus, setActiveStatus] = useState("all");

  // status khớp với STATUS_CHOICES ở backend bạn gửi:
  // booked / confirmed / completed / cancelled / no_show
  const statusOptions = [
    { id: "all", label: "All" },
    { id: "booked", label: "Booked" },
    { id: "confirmed", label: "Confirmed" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
    { id: "no_show", label: "No show" },
  ];

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const [profileRes, appointmentsRes, recordsRes, metricsRes] =
          await Promise.all([
            getMyProfile(),
            getMyAppointments(),
            getMyMedicalRecords(),
            getMyHealthTracking(),
          ]);

        if (cancelled) return;

        // --- MAP PROFILE (Users + Patient) ---
        const patientProfile = {
          id: profileRes.patient_id,
          userId: profileRes.user_id,
          name: profileRes.full_name,
          email: profileRes.email,
          phone: profileRes.phone_num,
          birthDate: profileRes.date_of_birth,
          address: profileRes.address,
          gender: profileRes.gender,
        };
        setUser(patientProfile);

        // --- MAP APPOINTMENTS (Appointment + Doctors) ---
        const mappedAppointments = (appointmentsRes || []).map((item) => ({
          id: item.appointment_id,
          date: item.appointment_date,
          time: item.appointment_time,
          status: item.status, // "booked", "confirmed", "completed", ...
          notes: item.notes,
          doctorId: item.doctor_id,
          doctorName: item.doctor?.full_name || "Unknown doctor",
          specialty: item.doctor?.specialization || "",
          location: item.doctor?.clinic_address || "MyHealthCare clinic",
        }));
        setAppointments(mappedAppointments);

        // --- MAP MEDICAL RECORDS ---
        const mappedRecords = (recordsRes || []).map((rec) => ({
          id: rec.record_id,
          appointmentId: rec.appointment_id,
          doctorId: rec.doctor_id,
          patientId: rec.patient_id,
          diagnosis: rec.diagnosis,
          treatment: rec.treatment,
          notes: rec.notes,
          visitDate: rec.visit_date,
        }));
        setRecords(mappedRecords);

        // --- MAP HEALTH TRACKING ---
        const metricsObj = {};
        (metricsRes || []).forEach((m) => {
          metricsObj[m.metric_type] = {
            value: m.value,
            unit: m.unit,
            measuredAt: m.measure_at,
            notes: m.notes,
          };
        });
        setMetrics(metricsObj);

        // --- BUILD STATS CARD TỪ DỮ LIỆU THẬT ---
        const upcomingCount = mappedAppointments.filter((a) =>
          ["booked", "confirmed"].includes(a.status)
        ).length;
        const completedCount = mappedAppointments.filter(
          (a) => a.status === "completed"
        ).length;
        const medicalRecordCount = mappedRecords.length;

        const statsCards = [
          {
            id: "upcoming",
            label: "Upcoming appointments",
            value: upcomingCount,
            icon: "📅",
          },
          {
            id: "records",
            label: "Medical records",
            value: medicalRecordCount,
            icon: "📄",
          },
          {
            id: "visited",
            label: "Completed visits",
            value: completedCount,
            icon: "✅",
          },
          {
            id: "health",
            label: "Health status",
            value: "Good",
            icon: "📈",
            highlight: true,
          },
        ];
        setStats(statsCards);
      } catch (err) {
        console.error("Failed to load patient dashboard, using demo data:", err);

        // fallback demo data để UI vẫn chạy được
        const demo = buildDemoData();
        setUser(demo.user);
        setAppointments(demo.appointments);
        setRecords(demo.records);
        setMetrics(demo.metrics);
        setStats(demo.stats);

        setError(
          err?.message ||
            "Cannot load data from server. Showing demo data instead."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const tabs = [
    { id: "appointments", label: "Appointments" },
    { id: "records", label: "Medical records" },
    { id: "metrics", label: "Health metrics" },
    { id: "profile", label: "Profile" },
  ];

  // Filter appointments theo activeStatus (để truyền xuống AppointmentList)
  const filteredAppointments =
    activeStatus === "all"
      ? appointments
      : appointments.filter((a) => a.status === activeStatus);

  return {
    user,
    stats,
    tabs,
    appointments: filteredAppointments,
    rawAppointments: appointments,
    records,
    metrics,
    activeTab,
    setActiveTab,
    statusOptions,
    activeStatus,
    setActiveStatus,
    loading,
    error,
  };
}
