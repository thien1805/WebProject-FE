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

/**
 * Create medical record for an appointment
 * POST /api/v1/appointments/{id}/medical-record/
 * 
 * @param {number} appointmentId - The appointment ID
 * @param {Object} data - Medical record data
 * @param {string} data.diagnosis - Doctor's diagnosis
 * @param {string} data.prescription - Prescription details
 * @param {string} data.treatment_plan - Treatment plan
 * @param {string} [data.notes] - Additional notes
 * @param {string} [data.follow_up_date] - Follow-up date (YYYY-MM-DD)
 * @param {Object} [data.vital_signs] - Vital signs object
 */
export const createMedicalRecord = async (appointmentId, data) => {
  try {
    const res = await apiClient.post(
      `${API_PREFIX}/appointments/${appointmentId}/medical-record/`,
      data
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Pay for medical record services
 * POST /api/v1/appointments/{id}/pay/
 * 
 * @param {number} appointmentId - The appointment ID
 * @param {string} paymentMethod - Payment method: 'card', 'ewallet', 'bank_transfer', 'cash'
 */
export const payMedicalRecord = async (appointmentId, paymentMethod) => {
  try {
    const res = await apiClient.post(
      `${API_PREFIX}/appointments/${appointmentId}/pay/`,
      { payment_method: paymentMethod }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
