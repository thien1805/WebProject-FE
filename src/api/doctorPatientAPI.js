// src/api/doctorPatientAPI.js
import apiClient from "./authAPI";

// Get list of patients that the doctor can see
export const getDoctorPatients = async (params = {}) => {
  // params có thể có page, search,... nếu backend hỗ trợ
  const response = await apiClient.get("/api/v1/patients/", { params });
  return response.data; // tuỳ backend: có thể là Array hoặc {results, count,...}
};

// Get detail of a single patient
export const getDoctorPatientDetail = async (patientId) => {
  const response = await apiClient.get(`/api/v1/patients/${patientId}/`);
  return response.data;
};

// Create new patient
export const createDoctorPatient = async (payload) => {
  const response = await apiClient.post("/api/v1/patients/", payload);
  return response.data;
};

// Update existing patient
export const updateDoctorPatient = async (patientId, payload) => {
  const response = await apiClient.put(`/api/v1/patients/${patientId}/`, payload);
  return response.data;
};

// Delete patient (nếu có)
export const deleteDoctorPatient = async (patientId) => {
  const response = await apiClient.delete(`/api/v1/patients/${patientId}/`);
  return response.data;
};
