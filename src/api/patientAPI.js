// src/api/patientAPI.js
import apiClient from "./authAPI"; // dùng chung axios instance + interceptor

// Lấy profile bệnh nhân hiện tại (từ user đang login)
export async function getMyProfile() {
  const res = await apiClient.get("/api/v1/user/me"); 
  return res.data;
}

// Lấy danh sách lịch hẹn của user hiện tại
export async function getMyAppointments(params = {}) {
  const res = await apiClient.get("/api/v1/appointments/my-appointments", {
    params, // ví dụ { status: 'upcoming' }
  });
  return res.data;
}

// Lấy hồ sơ bệnh án / kết quả xét nghiệm
export async function getMyMedicalRecords() {
  const res = await apiClient.get("/api/v1/medical-records/my-records");
  return res.data;
}

// Lấy các chỉ số sức khỏe được tracking
export async function getMyHealthTracking() {
  const res = await apiClient.get("/api/v1/health-tracking/my-metrics");
  return res.data;
}
