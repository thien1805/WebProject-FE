// src/pages/PatientDashboard/hooks/usePatientDashboard.js
import { useState, useEffect } from "react";
import {
  getMyProfile,
  getMyAppointments,
  getMyMedicalRecords,
  getMyHealthTracking,
} from "../../../api/patientAPI";
import { getMe } from "../../../api/authAPI";
import { useAuth } from "../../../context/AuthContext";

function buildStats(appointments = [], records = [], healthStatus = "Good") {
  const upcomingCount = appointments.filter((a) =>
    ["pending", "confirmed"].includes(a.status)
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
    { id: "pending", label: "Pending" },
    { id: "confirmed", label: "Confirmed" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  useEffect(() => {
    let cancelled = false;

    const isPastAppointment = (appt) => {
      if (!appt?.date || !appt?.time) return false;
      const dt = new Date(`${appt.date}T${appt.time}`);
      return Number.isFinite(dt.getTime()) && dt.getTime() < Date.now();
    };

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const [meRes, , appointmentsRes, recordsRes, metricsRes] =
          await Promise.all([
            getMe(),
            getMyProfile(),
            getMyAppointments(),
            getMyMedicalRecords(),
            getMyHealthTracking(),
          ]);

        if (cancelled) return;

        // Merge user data from /user/me with patient profile
        const patientProfile = {
          // From /user/me response
          id: meRes.id,
          email: meRes.email,
          full_name: meRes.full_name,
          phone_num: meRes.phone_num,
          role: meRes.role,
          is_active: meRes.is_active,
          created_at: meRes.created_at,
          updated_at: meRes.updated_at,
          patient_profile: meRes.patient_profile,
          doctor_profile: meRes.doctor_profile,
          // Legacy fields for compatibility
          name: meRes.full_name,
          phone: meRes.phone_num,
          ...meRes, // include all fields from /user/me
        };
        
        console.log("🔍 Patient Profile:", patientProfile);
        console.log("🔍 Full Name:", patientProfile.full_name);
        console.log("🔍 Email:", patientProfile.email);
        
        setUser(patientProfile);

        const mappedAppointments = (appointmentsRes || []).map((item) => {
          const rawStatus = (item.status || "").toLowerCase();
          const normalizedStatus = rawStatus === "booked" ? "pending" : rawStatus;
          return {
            id: item.appointment_id,
            date: item.appointment_date,
            time: item.appointment_time,
            status: normalizedStatus,
            notes: item.notes,
            doctorId: item.doctor_id,
            doctorName: item.doctor?.full_name || "Unknown doctor",
            specialty: item.doctor?.specialization || "",
            location: item.doctor?.clinic_address || "MyHealthCare clinic",
          };
        });

        // Auto-cancel past appointments that are still pending/confirmed
        const expiredIds = [];
        const normalizedAppointments = mappedAppointments.map((appt) => {
          const shouldCancel =
            isPastAppointment(appt) &&
            ["pending", "confirmed"].includes(appt.status);
          if (shouldCancel) {
            expiredIds.push(appt.id);
            return { ...appt, status: "cancelled" };
          }
          return appt;
        });

        if (expiredIds.length > 0) {
          // Best effort update backend; ignore errors per item
          Promise.allSettled(
            expiredIds.map((id) =>
              cancelAppointment(id, "Auto-cancelled: appointment time passed.")
            )
          ).catch(() => {});
        }

        setAppointments(normalizedAppointments);

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
          buildStats(normalizedAppointments, mappedRecords, latestHealthStatus)
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
    { id: "appointments", label: "Appointments" }, // now history
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
