// src/api/authAPI.js
import axios from "axios";

const RAW_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_BASE_URL = RAW_BASE_URL.replace(/\\/api\\/v1\\/?$/, "");
const API_PREFIX = "/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const access = localStorage.getItem("access_token");
  if (access) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// ---- Helpers ----
function saveAuthToStorage({ user, tokens }) {
  if (tokens?.access) {
    localStorage.setItem("access_token", tokens.access);
  }
  if (tokens?.refresh) {
    localStorage.setItem("refresh_token", tokens.refresh);
  }
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export function getCurrrentUser() {
  // 👈 tên hàm này cố tình sai chính tả để khớp import của bạn
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const access = localStorage.getItem("access_token");
  return !!access;
}

// ---- LOGIN ----
export async function login({ email, password }) {
  const res = await fetch(`${API_BASE_URL}${API_PREFIX}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    // backend trả: { success: False, message: "Invalid email or password" }
    const message = data?.message || "Login failed";
    throw new Error(message);
  }

  // data = { success, message, user, tokens: { refresh, access } }
  saveAuthToStorage({ user: data.user, tokens: data.tokens });

  return data; // cho AuthContext dùng
}

// ---- LOGOUT ----
export async function logout() {
  const refresh = localStorage.getItem("refresh_token");

  try {
    if (refresh) {
      await fetch(`${API_BASE_URL}${API_PREFIX}/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
        body: JSON.stringify({ refresh }),
      });
    }
  } catch (err) {
    console.error("Logout API error:", err);
    // vẫn clear localStorage dù API fail
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }
}

// ---- GET PROFILE (từ backend) ----
export async function fetchProfile() {
  const access = localStorage.getItem("access_token");
  if (!access) throw new Error("No access token");

  const res = await fetch(`${API_BASE_URL}${API_PREFIX}/user/profile/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.detail || data?.message || "Failed to fetch profile";
    throw new Error(msg);
  }

  // data = UserSerializer (có patient_profile / doctor_profile tuỳ role)
  localStorage.setItem("user", JSON.stringify(data));
  return data;
}

// ---- UPDATE PROFILE (PATCH) ----
export async function updateProfile(profilePayload) {
  const access = localStorage.getItem("access_token");
  if (!access) throw new Error("No access token");

  const res = await fetch(`${API_BASE_URL}${API_PREFIX}/user/profile/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profilePayload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // lỗi validate sẽ trả { field: ["msg"] }
    throw data || { message: "Failed to update profile" };
  }

  // Backend đã trả lại User đầy đủ sau khi update
  localStorage.setItem("user", JSON.stringify(data));
  return data;
}

export default apiClient;
