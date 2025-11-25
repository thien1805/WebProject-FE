// src/pages/Doctor-dashboard/Doctor-appointments/hooks/useDoctorAppointmentList.js
import { useMemo, useState } from "react";

// Trùng với STATUS_CHOICES bên backend (value)
// label dùng để hiển thị trên UI
const STATUS_CHOICES = [
  { value: "booked", label: "Booked" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No show" },
];

// DEMO DATA – sau này thay bằng dữ liệu từ API
const INITIAL_APPOINTMENTS = [
  {
    id: 1,
    patient: "Nguyen Van A",
    status: "booked",
    notes: "General checkup",
    date: "2025-11-15",
    time: "09:00",
  },
  {
    id: 2,
    patient: "Tran Thi B",
    status: "confirmed",
    notes: "Follow up",
    date: "2025-11-15",
    time: "10:30",
  },
  {
    id: 3,
    patient: "Le Minh C",
    status: "completed",
    notes: "Surgery",
    date: "2025-11-10",
    time: "14:00",
  },
  {
    id: 4,
    patient: "Pham D",
    status: "cancelled",
    notes: "No show",
    date: "2025-11-08",
    time: "16:00",
  },
];

export function useDoctorAppointmentList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | booked | ...
  const [dateFilter, setDateFilter] = useState("");         // 'YYYY-MM-DD'
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  // đổi trạng thái 1 lịch hẹn (hiện tại chỉ cập nhật local state)
  const updateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: newStatus } : appt
      )
    );
  };

  const rows = useMemo(() => {
    return appointments.filter((appt) => {
      const matchSearch =
        !search ||
        appt.patient.toLowerCase().includes(search.trim().toLowerCase());

      const matchStatus =
        statusFilter === "all" || appt.status === statusFilter;

      const matchDate = !dateFilter || appt.date === dateFilter;

      return matchSearch && matchStatus && matchDate;
    });
  }, [appointments, search, statusFilter, dateFilter]);

  return {
    rows,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    statusChoices: STATUS_CHOICES,
    updateStatus,
  };
}
