// src/api/authAPI.js
import axios from "axios";

// 🔹 1. Lấy BASE_URL (host), ưu tiên env, mặc định về Azure backend
//    VITE_API_BASE_URL có thể là:
//    - "https://myhealthcare-api-h3amhrevg2feeab9.southeastasia-01.azurewebsites.net"
//    - ".../api/v1"
//    - "http://localhost:8000"
// Cố định base URL về Azure đã deploy
const RAW_BASE_URL = "https://myhealthcare-api-h3amhrevg2feeab9.southeastasia-01.azurewebsites.net";

// 🔹 2. Nếu lỡ đặt VITE_API_BASE_URL = ".../api/v1" thì cắt bỏ phần /api/v1
//    Regex đúng phải là /\/api\/v1\/?$/ (dùng /, không phải \)
const API_BASE_URL = RAW_BASE_URL.replace(/\/api\/v1\/?$/, "");

// 🔹 3. Prefix cố định cho REST API
export const API_PREFIX = "/api/v1";

// 🔹 4. Axios client: baseURL chỉ là host
//    → Khi dùng axios ở chỗ khác có thể gọi: apiClient.get(`${API_PREFIX}/...`)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Helpers lưu/xóa token
function clearAuthStorage() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

// Tự động gắn Bearer access token cho mọi request axios
apiClient.interceptors.request.use((config) => {
  const access = localStorage.getItem("access_token");
  if (access) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Token refresh (Simple JWT style)
let refreshPromise = null;
async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("No refresh token");

  const res = await fetch(`${API_BASE_URL}${API_PREFIX}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.access) {
    throw data || { message: "Cannot refresh token" };
  }

  saveAuthToStorage({
    user: getCurrrentUser(),
    tokens: { access: data.access, refresh },
  });
  return data;
}

// Axios response interceptor: auto refresh 1 lần khi 401 rồi retry request
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error.config || {};

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }
        const tokens = await refreshPromise;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${tokens.access}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        clearAuthStorage();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error?.response?.data || error?.message || error);
  }
);

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

// ---- REFRESH TOKEN (manual call nếu cần) ----
export async function refreshToken() {
  return refreshAccessToken();
}

// ---- REGISTER ----
export async function register(payload) {
  const res = await fetch(`${API_BASE_URL}${API_PREFIX}/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw data || { message: "Register failed" };
  }

  // Một số backend trả luôn tokens + user, nếu có thì lưu lại
  if (data?.tokens || data?.user) {
    saveAuthToStorage({ user: data.user, tokens: data.tokens });
  }

  return data;
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
    const message = data?.message || "Login failed";
    throw new Error(message);
  }

  // data = { success, message, user, tokens: { refresh, access } }
  saveAuthToStorage({ user: data.user, tokens: data.tokens });

  return data;
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
  } finally {
    clearAuthStorage();
  }
}

// ---- LOGOUT ALL SESSIONS ----
export async function logoutAll() {
  const refresh = localStorage.getItem("refresh_token");

  try {
    if (refresh) {
      await fetch(`${API_BASE_URL}${API_PREFIX}/auth/logout-all/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
        body: JSON.stringify({ refresh }),
      });
    }
  } catch (err) {
    console.error("Logout-all API error:", err);
  } finally {
    clearAuthStorage();
  }
}

// ---- GET PROFILE ----
export async function fetchProfile() {
  const res = await apiClient.get(`${API_PREFIX}/me/`);
  const data = res.data;
  localStorage.setItem("user", JSON.stringify(data));
  return data;
}

// Alias cho code cũ gọi getProfile
export async function getProfile() {
  return fetchProfile();
}

// ---- UPDATE PROFILE ----
export async function updateProfile(profilePayload, method = "PATCH") {
  const verb = method.toUpperCase() === "PUT" ? "put" : "patch";
  const res = await apiClient[verb](`${API_PREFIX}/me/`, profilePayload);
  const data = res.data;
  localStorage.setItem("user", JSON.stringify(data));
  return data;
}

export default apiClient;
