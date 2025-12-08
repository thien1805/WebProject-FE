// src/api/medicalRecordAPI.js
import apiClient, { API_PREFIX } from "./authAPI";

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
    const res = await apiClient.get(`${API_PREFIX}/medical-records/`, {
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
    const res = await apiClient.get(`${API_PREFIX}/medical-records/${id}/`);
    return res.data; // 1 object record
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Tạo medical record mới (doctor gửi sau khi khám)
export const createMedicalRecord = async (payload) => {
  // Expected payload: {
  //   appointment_id: string,
  //   diagnosis: string,
  //   treatment: string,
  //   notes?: string,
  //   doctor_comment?: string,
  //   health_status: string (e.g., "Good", "Fair", "Poor")
  // }
  if (!payload?.appointment_id) {
    throw new Error("appointment_id is required");
  }
  try {
    const res = await apiClient.post(
      `${API_PREFIX}/medical-records/`,
      payload
    );
    return res.data; // { success: true, data: { record_id, ... } } hoặc object record
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cập nhật medical record đã tồn tại (doctor chỉnh sửa)
export const updateMedicalRecord = async (id, payload) => {
  if (!id) throw new Error("Record id is required");
  try {
    const res = await apiClient.put(
      `${API_PREFIX}/medical-records/${id}/`,
      payload
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Xóa medical record (nếu cần)
export const deleteMedicalRecord = async (id) => {
  if (!id) throw new Error("Record id is required");
  try {
    const res = await apiClient.delete(`${API_PREFIX}/medical-records/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
