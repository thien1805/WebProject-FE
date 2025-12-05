// src/api/appointmentAPI.js
// All appointment-related APIs (patient side + future AI helper)

import apiClient from "./authAPI";

// Helper build query string từ object
const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
};

/**
 * 1. Get available time slots
 *    GET /api/v1/appointments/available-slots/
 *
 * @param {Object} options
 * @param {number|string} options.doctorId
 * @param {string} options.date         // "YYYY-MM-DD"
 * @param {number|string} [options.serviceId]
 */
export const getAvailableSlots = async ({ doctorId, date, serviceId }) => {
  try {
    const query = buildQueryString({
      doctor_id: doctorId,
      date,
      service_id: serviceId,
    });

    const response = await apiClient.get(
      `/api/v1/appointments/available-slots/${query}`
    );

    // Doc trả:
    // {
    //   "date": "...",
    //   "doctor": {...},
    //   "available_slots": [{ time, available, room }, ...]
    // }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 2. Book appointment
 *    POST /api/v1/appointments/
 *
 * Body theo doc:
 * {
 *   doctor_id,
 *   service_id,
 *   appointment_date: "YYYY-MM-DD",
 *   appointment_time: "HH:MM",
 *   reason,
 *   notes
 * }
 */
export const bookAppointment = async (payload) => {
  try {
    const response = await apiClient.post("/api/v1/appointments/", payload);
    // Thành công: { success, message, appointment: { ... } }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 3. Get my appointments (patient dashboard)
 *    GET /api/v1/appointments/my-appointments/
 *
 * @param {Object} options
 * @param {string} [options.status]      // booked|confirmed|completed|cancelled|no_show
 * @param {string} [options.dateFrom]    // "YYYY-MM-DD"
 * @param {string} [options.dateTo]      // "YYYY-MM-DD"
 * @param {number} [options.page=1]
 * @param {number} [options.pageSize]    // theo Implementation Notes: page_size
 */
export const getMyAppointments = async ({
  status,
  dateFrom,
  dateTo,
  page = 1,
  pageSize,
} = {}) => {
  try {
    const query = buildQueryString({
      status,
      date_from: dateFrom,
      date_to: dateTo,
      page,
      page_size: pageSize,
    });

    const response = await apiClient.get(
      `/api/v1/appointments/my-appointments/${query}`
    );
    // Doc trả: { count, next, previous, results: [ ... ] }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 4. Cancel appointment
 *    POST /api/v1/appointments/{id}/cancel/
 *
 * Body:
 * { reason: "..." }
 */
export const cancelAppointment = async (appointmentId, reason) => {
  try {
    const response = await apiClient.post(
      `/api/v1/appointments/${appointmentId}/cancel/`,
      { reason }
    );
    // { success, message, appointment: { ... } }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 5. Reschedule appointment
 *    PUT /api/v1/appointments/{id}/reschedule/
 *
 * Body:
 * {
 *   new_date: "YYYY-MM-DD",
 *   new_time: "HH:MM",
 *   reason: "..."
 * }
 */
export const rescheduleAppointment = async (
  appointmentId,
  { new_date, new_time, reason }
) => {
  try {
    const response = await apiClient.put(
      `/api/v1/appointments/${appointmentId}/reschedule/`,
      { new_date, new_time, reason }
    );
    // { success, message, appointment: { ... } }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 6. (Future) AI suggestion for appointment
 *    POST /api/v1/ai/suggest-appointment/
 *
 * !!! HIỆN TẠI: backend CHƯA có endpoint này.
 * Khi bạn implement xong ở Django, chỉ cần sửa TODO bên trong.
 *
 * @param {Object} payload
 * @param {string} payload.symptoms
 * @param {string[]} [payload.selectedSymptoms]
 * @param {string} [payload.preferredDate]  // "YYYY-MM-DD"
 * @param {number} [payload.patientId]
 *
 * Expected response (gợi ý):
 * {
 *   success: true,
 *   message: "...",
 *   data: {
 *     specialty: { id, name },
 *     doctor: { id, full_name, ... },
 *     service: { id, name },
 *     suggested_slots: [{ date, time, room, available }, ...]
 *   }
 * }
 */
export const suggestAppointmentAI = async ({
  symptoms,
  selectedSymptoms,
  preferredDate,
  patientId,
}) => {
  try {
    const response = await apiClient.post(
      "/api/v1/ai/suggest-appointment/",
      {
        symptoms,
        selected_symptoms: selectedSymptoms,
        preferred_date: preferredDate,
        patient_id: patientId,
      }
    );
    return response.data;

    // ===== BACKUP: Nếu backend chưa implement, sử dụng fake data =====
    /*
    console.warn(
      "[suggestAppointmentAI] Backend API chưa implement. Trả về dữ liệu fake."
    );

    const fakeSpecialtyId = "cardio";
    const fakeDoctorId = 5;

    return {
      success: true,
      message: "Demo suggestion (local rule-based).",
      data: {
        specialty: {
          id: fakeSpecialtyId,
          name: "Cardiology",
        },
        doctor: {
          id: fakeDoctorId,
          full_name: "Dr. Demo Cardiologist",
          specialization: "Cardiology",
          experience_years: 10,
          rating: 4.8,
        },
        service: {
          id: 3,
          name: "Cardiology consultation",
        },
        suggested_slots: [
          { date: preferredDate, time: "09:00", room: "P101", available: true },
          { date: preferredDate, time: "09:30", room: "P101", available: true },
        ],
      },
    };
    */
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
