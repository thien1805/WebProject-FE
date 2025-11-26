// src/pages/PatientDashboard/hooks/usePatientDashboard.js
import { useState, useEffect } from "react";
import {
  getMyProfile,
  getMyAppointments,
  getMyMedicalRecords,
  getMyHealthTracking,
} from "../../../api/patientAPI";
import { useAuth } from "../../../context/AuthContext";

function buildStats(appointments = [], records = [], healthStatus = "Good") {
  const upcomingCount = appointments.filter((a) =>
    ["booked", "confirmed"].includes(a.status)
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "completed"
  ).length;
  const medicalRecordCount = records.length;

  return [
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
      icon: "📁",
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
      value: healthStatus,
      icon: "❤️",
      highlight: true,
    },
  ];
}

export function usePatientDashboard() {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState("appointments");

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeStatus, setActiveStatus] = useState("all");

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

        const mappedAppointments = (appointmentsRes || []).map((item) => ({
          id: item.appointment_id,
          date: item.appointment_date,
          time: item.appointment_time,
          status: item.status,
          notes: item.notes,
          doctorId: item.doctor_id,
          doctorName: item.doctor?.full_name || "Unknown doctor",
          specialty: item.doctor?.specialization || "",
          location: item.doctor?.clinic_address || "MyHealthCare clinic",
        }));
        setAppointments(mappedAppointments);

        const mappedRecords = (recordsRes || []).map((rec) => ({
          id: rec.record_id,
          appointmentId: rec.appointment_id,
          doctorId: rec.doctor_id,
          patientId: rec.patient_id,
          diagnosis: rec.diagnosis,
          treatment: rec.treatment,
          notes: rec.notes,
          visitDate: rec.visit_date,
          healthStatus: rec.health_status || rec.healthStatus,
        }));
        setRecords(mappedRecords);

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

        const sortedByDate = [...mappedRecords].sort((a, b) => {
          const da = new Date(a.visitDate || 0).getTime();
          const db = new Date(b.visitDate || 0).getTime();
          return db - da;
        });
        const latestHealthStatus =
          sortedByDate[0]?.healthStatus ||
          sortedByDate[0]?.diagnosis ||
          sortedByDate[0]?.treatment ||
          "Good";

        setStats(
          buildStats(mappedAppointments, mappedRecords, latestHealthStatus)
        );
      } catch (err) {
        console.error("Failed to load patient dashboard:", err);

        const status = err?.response?.status;
        const message =
          status === 404
            ? null
            : err?.response?.data?.message ||
              err?.message ||
              "Cannot load data from server.";

        setError(message);

        if (!cancelled) {
          const fallbackUser = authUser
            ? {
                id: authUser.id || authUser.userId,
                userId: authUser.userId || authUser.id,
                name:
                  authUser.fullName ||
                  authUser.name ||
                  authUser.username ||
                  "Patient",
                email: authUser.email,
              }
            : null;

          setUser(fallbackUser);
          setAppointments([]);
          setRecords([]);
          setMetrics(null);
          setStats(buildStats([], [], "Good"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [authUser]);

  const tabs = [
    { id: "appointments", label: "Appointments" },
    { id: "records", label: "Medical records" },
    { id: "profile", label: "Profile" },
  ];

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
