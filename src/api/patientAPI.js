// src/api/patientAPI.js
import apiClient, { API_PREFIX } from "./authAPI"; // dùng chung axios instance + interceptor

// Lấy profile bệnh nhân hiện tại (từ user đang login)
export async function getMyProfile() {
  const res = await apiClient.get("/api/v1/user/me"); 
  return res.data;
}

// Lấy danh sách lịch hẹn của user hiện tại
export async function getMyAppointments(params = {}) {
  const tryPaths = [
    `${API_PREFIX}/appointments/my-appointments`,
    `${API_PREFIX}/appointments/`,
  ];

  for (const path of tryPaths) {
    try {
      const res = await apiClient.get(path, { params });
      return res.data;
    } catch (err) {
      const status = err?.response?.status;
      if (status !== 404 && status !== 401 && status !== 403) {
        throw err;
      }
    }
  }

  return [];
}

// Note: Medical records are fetched from appointment's medical_record field
// No separate /medical-records/my-records or /health-tracking/my-metrics endpoints
