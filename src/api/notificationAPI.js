// src/api/notificationAPI.js
import apiClient, { API_PREFIX } from "./authAPI";

/**
 * Get all notifications for the current patient
 * For now, generates notifications from appointments data
 * @returns {Promise<Array>} List of notifications
 */
export async function getPatientNotifications() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return { results: [], error: "Not authenticated" };
    }

    // Get patient's appointments to generate notifications
    const response = await apiClient.get(`${API_PREFIX}/patient/appointments/`);

    const appointments = response.data?.results || response.data || [];
    const notifications = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    appointments.forEach((appt) => {
      const apptDate = new Date(appt.appointment_date);
      apptDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((apptDate - today) / (1000 * 60 * 60 * 24));
      
      // Appointment reminder - upcoming within 3 days
      if (appt.status === "upcoming" && diffDays >= 0 && diffDays <= 3) {
        let timeLabel = "";
        if (diffDays === 0) {
          timeLabel = "Hôm nay";
        } else if (diffDays === 1) {
          timeLabel = "Ngày mai";
        } else {
          timeLabel = `Còn ${diffDays} ngày`;
        }

        notifications.push({
          id: `reminder-${appt.id}`,
          type: "reminder",
          title: "Nhắc nhở lịch hẹn",
          message: `Bạn có lịch hẹn với ${appt.doctor_name || "bác sĩ"} lúc ${(appt.appointment_time || "").slice(0, 5)}`,
          time: timeLabel,
          unread: diffDays <= 1, // Mark as unread if today or tomorrow
          appointmentId: appt.id,
          date: appt.appointment_date,
        });
      }

      // Recently completed (within last 7 days)
      if (appt.status === "completed") {
        const completedDaysAgo = Math.ceil((today - apptDate) / (1000 * 60 * 60 * 24));
        if (completedDaysAgo >= 0 && completedDaysAgo <= 7) {
          notifications.push({
            id: `completed-${appt.id}`,
            type: "completed",
            title: "Khám hoàn thành",
            message: `Lịch khám với ${appt.doctor_name || "bác sĩ"} đã hoàn thành`,
            time: completedDaysAgo === 0 ? "Hôm nay" : `${completedDaysAgo} ngày trước`,
            unread: completedDaysAgo === 0,
            appointmentId: appt.id,
            date: appt.appointment_date,
          });
        }
      }

      // Recently cancelled (within last 3 days)
      if (appt.status === "cancelled") {
        const cancelledDaysAgo = Math.ceil((today - apptDate) / (1000 * 60 * 60 * 24));
        if (cancelledDaysAgo >= 0 && cancelledDaysAgo <= 3) {
          notifications.push({
            id: `cancelled-${appt.id}`,
            type: "cancelled",
            title: "Lịch hẹn đã hủy",
            message: `Lịch hẹn với ${appt.doctor_name || "bác sĩ"} đã bị hủy`,
            time: cancelledDaysAgo === 0 ? "Hôm nay" : `${cancelledDaysAgo} ngày trước`,
            unread: cancelledDaysAgo === 0,
            appointmentId: appt.id,
            date: appt.appointment_date,
          });
        }
      }
    });

    // Sort by unread first, then by date
    notifications.sort((a, b) => {
      if (a.unread !== b.unread) return a.unread ? -1 : 1;
      return new Date(b.date) - new Date(a.date);
    });

    return { results: notifications.slice(0, 10) }; // Return max 10 notifications
  } catch (error) {
    console.error("Get notifications error:", error);
    return { 
      results: [], 
      error: error.response?.data?.detail || error.message 
    };
  }
}

/**
 * Mark all notifications as read
 * For now, this is client-side only since we don't have a backend model
 */
export async function markAllNotificationsRead() {
  // TODO: When backend notification model is ready, call API here
  // For now, just return success
  return { success: true };
}
