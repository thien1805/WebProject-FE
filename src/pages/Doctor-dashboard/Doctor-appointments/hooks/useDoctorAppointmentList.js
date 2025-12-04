// src/pages/Doctor-dashboard/Doctor-appointments/hooks/useDoctorAppointmentList.js
import { useMemo, useState } from "react";

// Trùng với STATUS_CHOICES bên backend (value)
// label dùng để hiển thị trên UI
const STATUS_CHOICES = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// DEMO DATA – sau này thay bằng dữ liệu từ API
const INITIAL_APPOINTMENTS = [
  {
    id: 1,
    patient: "Nguyen Van A",
    status: "pending",
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

  const hasConflict = (id, date, time) => {
    if (!date || !time) return false;
    const target = new Date(`${date}T${time}`);
    if (!Number.isFinite(target.getTime())) return false;
    const windowMs = 30 * 60 * 1000; // 30 phút

    return appointments.some((appt) => {
      if (appt.id === id) return false;
      if (appt.status === "cancelled") return false;
      if (appt.date !== date) return false;
      const other = new Date(`${appt.date}T${appt.time}`);
      if (!Number.isFinite(other.getTime())) return false;
      return Math.abs(other.getTime() - target.getTime()) < windowMs;
    });
  };

  const isFutureSlot = (date, time) => {
    if (!date || !time) return false;
    const dt = new Date(`${date}T${time}`);
    return Number.isFinite(dt.getTime()) && dt.getTime() > Date.now();
  };

  // đổi trạng thái 1 lịch hẹn (hiện tại chỉ cập nhật local state)
  const updateStatus = (id, newStatus) => {
    if (newStatus === "confirmed") {
      const current = appointments.find((a) => a.id === id);
      if (current && hasConflict(id, current.date, current.time)) {
        alert("Lịch trình của bạn không khả dụng");
        return;
      }
    }

    if (newStatus === "completed") {
      const current = appointments.find((a) => a.id === id);
      if (current && isFutureSlot(current.date, current.time)) {
        alert(
          "Chưa tới thời gian trên lịch khám, không thể nhấn complete appointment này"
        );
        return;
      }
    }

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
