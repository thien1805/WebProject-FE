// src/api/medicalRecordAPI.js
import apiClient from "./authAPI";

// Lấy danh sách medical records (patient hoặc doctor)
export const getMedicalRecords = async ({
  patientId,
  doctorId,
  dateFrom,
  dateTo,
  page,
  pageSize,
} = {}) => {
  try {
    const res = await apiClient.get("/api/v1/medical-records/", {
      params: {
        patient_id: patientId,
        doctor_id: doctorId,
        date_from: dateFrom,
        date_to: dateTo,
        page,
        page_size: pageSize,
      },
    });
    // { count, next, previous, results: [...] }
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMedicalRecordDetail = async (id) => {
  if (!id) throw new Error("Record id is required");
  try {
    const res = await apiClient.get(`/api/v1/medical-records/${id}/`);
    return res.data; // 1 object record
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
