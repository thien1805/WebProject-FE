// src/api/appointmentAPI.js
import apiClient from "./authAPI";

// Lấy danh sách lịch hẹn của user hiện tại
export const getMyAppointments = async (params = {}) => {
  // params có thể chứa status, date_from, date_to ... nếu backend hỗ trợ
  const response = await apiClient.get(
    "/api/v1/appointments/my-appointments",
    { params }
  );
  return response.data;
};

// Đặt lịch khám mới
export const bookAppointment = async (payload) => {
  const response = await apiClient.post("/api/v1/appointments/", payload);
  return response.data;
};

// Cập nhật / đổi lịch (reschedule)
export const rescheduleAppointment = async (id, payload) => {
  const response = await apiClient.post(
    `/api/v1/appointments/${id}/reschedule/`,
    payload
  );
  return response.data;
};

// Hủy lịch
export const cancelAppointment = async (id) => {
  const response = await apiClient.post(
    `/api/v1/appointments/${id}/cancel/`
  );
  return response.data;
};
