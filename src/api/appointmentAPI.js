// src/api/appointmentAPI.js
// All appointment-related APIs (patient side + doctor side + future AI helper)

import apiClient, { API_PREFIX } from "./authAPI";


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
 *    GET /api/v1/available-slots/?doctor_id=&date=&department_id=
 *
 * @param {Object} options
 * @param {number|string} options.doctorId
 * @param {string} options.date         // "YYYY-MM-DD"
 * @param {number|string} [options.departmentId]
 */
export const getAvailableSlots = async ({ doctorId, date, departmentId }) => {
  try {
    const query = buildQueryString({
      doctor_id: doctorId,
      date,
      department_id: departmentId,
    });

    const response = await apiClient.get(
      `${API_PREFIX}/available-slots/${query}`
    );

    // Backend trả:
    // {
    //   date: "2024-01-15",
    //   doctor: { id, full_name, specialization },
    //   department?: { id, name, icon },
    //   available_slots: [{ time, available, room }, ...]
    // }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 2. Book appointment (patient tạo lịch)
 *    POST /api/v1/appointments/
 *
 * Body theo AppointmentCreateSerializer:
 * {
 *   doctor_id,
 *   department_id,
 *   appointment_date: "YYYY-MM-DD",
 *   appointment_time: "HH:MM" hoặc "HH:MM:SS",
 *   symptoms,
 *   reason,
 *   notes
 * }
 *
 * Trả về:
 * {
 *   success: true,
 *   message: "...",
 *   appointment: { ...full Appointment... }
 * }
 */
export const bookAppointment = async (payload) => {
  try {
    const response = await apiClient.post(
      `${API_PREFIX}/appointments/`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 3. My appointments (dùng custom action trong AppointmentViewSet)
 *    GET /api/v1/appointments/my-appointments/
 *    Tự động trả về:
 *    - nếu user là patient → appointment của patient
 *    - nếu doctor → appointment của doctor
 *    - nếu admin → tất cả
 *
 * Query:
 *   ?status=&date_from=&date_to=&page=
 * (page_size không dùng trong action này, nhưng truyền cũng không sao)
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
      `${API_PREFIX}/appointments/my-appointments/${query}`
    );
    // my-appointments hiện tại KHÔNG paginate: trả về [ ...appointments ]
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 3b. Patient appointments riêng (PatientAppointmentViewSet)
 *     GET /api/v1/patient/appointments/
 *     Có pagination (PageNumberPagination)
 */
export const getPatientAppointments = async ({
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
      `${API_PREFIX}/patient/appointments/${query}`
    );
    // Trả về dạng pagination: { count, next, previous, results: [...] }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 3c. Doctor appointments riêng (DoctorAppointmentViewSet)
 *     GET /api/v1/doctor/appointments/
 */
export const getDoctorAppointments = async ({
  status,
  dateFrom,
  dateTo,
  patientId,
  page = 1,
  pageSize,
} = {}) => {
  try {
    const query = buildQueryString({
      status,
      date_from: dateFrom,
      date_to: dateTo,
      patient_id: patientId,
      page,
      page_size: pageSize,
    });

    const response = await apiClient.get(
      `${API_PREFIX}/doctor/appointments/${query}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 4. Get appointment detail (bao gồm medical_record nếu có)
 *    GET /api/v1/appointments/{id}/
 */
export const getAppointmentDetail = async (appointmentId) => {
  try {
    const response = await apiClient.get(
      `${API_PREFIX}/appointments/${appointmentId}/`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 5. Cancel appointment
 *    POST /api/v1/appointments/{id}/cancel/
 *
 * Body:
 * { reason: "..." }
 *
 * Trả về:
 * {
 *   success: true/false,
 *   message|error: "...",
 *   appointment?: { ... }
 * }
 */
export const cancelAppointment = async (appointmentId, reason) => {
  try {
    const response = await apiClient.post(
      `${API_PREFIX}/appointments/${appointmentId}/cancel/`,
      { reason }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 6. Reschedule appointment
 *    PUT /api/v1/appointments/{id}/reschedule/
 *    (methods=['put'] trong backend → phải dùng PUT)
 *
 * Body:
 * {
 *   new_date: "YYYY-MM-DD",
 *   new_time: "HH:MM" hoặc "HH:MM:SS",
 *   reason: "...",
 * }
 */
export const rescheduleAppointment = async (
  appointmentId,
  { new_date, new_time, reason }
) => {
  try {
    const response = await apiClient.put(
      `${API_PREFIX}/appointments/${appointmentId}/reschedule/`,
      { new_date, new_time, reason }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 7. (Future) AI suggestion for appointment
 *    POST /api/v1/ai/suggest-appointment/
 *
 * Hiện tại backend chưa có endpoint này → vẫn giữ fake demo.
 */
export const suggestAppointmentAI = async ({
  symptoms,
  selectedSymptoms,
  preferredDate,
  patientId,
}) => {
  try {
    const response = await apiClient.post(
      `${API_PREFIX}/ai/suggest-appointment/`,
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
