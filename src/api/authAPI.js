// src/api/authAPI.js
import axios from "axios";

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://myhealthcare-api-h3amhrevg2feeab9.southeastasia-01.azurewebsites.net/";

// 🔹 2. Nếu lỡ đặt VITE_API_BASE_URL = ".../api/v1" thì cắt bỏ phần /api/v1
//    Regex đúng phải là /\/api\/v1\/?$/ (dùng /, không phải \)
const API_BASE_URL = RAW_BASE_URL.replace(/\/api\/v1\/?$/, "");

// 🔹 3. Prefix cố định cho REST API
export const API_PREFIX = "/api/v1";

// 🔹 4. Axios client: baseURL chỉ là host
//    → Khi dùng axios ở chỗ khác có thể gọi: apiClient.get(`${API_PREFIX}/...`)
const apiClient = axios.create({
  baseURL: RAW_BASE_URL,
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
  const res = await fetch(`${RAW_BASE_URL}api/v1/auth/login/`, {
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
      await fetch(`${RAW_BASE_URL}api/v1/auth/logout/`, {
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
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "/home";
  }
}

// ---- REGISTER ----
export async function register(payload) {
  const res = await fetch(`${RAW_BASE_URL}api/v1/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    // Ném nguyên payload lỗi để UI hiển thị đúng từng field
    throw data || { message: "Registration failed" };
  }

  // Lưu token + user xuống localStorage để auto đăng nhập sau đăng ký
  saveAuthToStorage({ user: data.user, tokens: data.tokens });
  return data;
}

// ---- FORGOT PASSWORD (request email) ----
export async function requestPasswordReset({ email }) {
  const res = await fetch(`${RAW_BASE_URL}api/v1/auth/forgot-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    const msg = data?.message || data?.detail || "Failed to send password reset email";
    throw new Error(msg);
  }

  return data;
}

// ---- VERIFY RESET TOKEN (optional) ----
export async function verifyResetToken({ uid, token }) {
  const res = await fetch(`${RAW_BASE_URL}api/v1/auth/verify-reset-token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid, token }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    const msg = data?.message || data?.detail || "Token is invalid or has expired";
    throw new Error(msg);
  }

  return data;
}

// ---- RESET PASSWORD ----
export async function resetPassword({ uid, token, newPassword, confirmPassword }) {
  const res = await fetch(`${RAW_BASE_URL}api/v1/auth/reset-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid,
      token,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    const msg = data?.message || data?.detail || "Reset password failed";
    throw new Error(msg);
  }

  return data;
}

// ---- GET PROFILE ----
export async function getProfile() {
  const access = localStorage.getItem("access_token");
  if (!access) throw new Error("No access token");

  const res = await fetch(`${RAW_BASE_URL}api/v1/user/profile/`, {
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
}

  // Lưu user profile vào localStorage
  localStorage.setItem("user", JSON.stringify(data));
  return data;
}

// Alias cho code cũ gọi getProfile
export async function getProfile() {
  return fetchProfile();
}

  const res = await fetch(`${RAW_BASE_URL}api/v1/user/profile/`, {
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

// ---- GET ME (CURRENT USER INFO) ----
export async function getMe() {
  const access = localStorage.getItem("access_token");
  if (!access) throw new Error("No access token");

  const res = await fetch(`${RAW_BASE_URL}api/v1/user/me/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.detail || data?.message || "Failed to fetch user info";
    throw new Error(msg);
  }

  return data;
}

export default apiClient;