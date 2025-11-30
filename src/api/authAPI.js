// src/api/authAPI.js
import axios from "axios";
import API_BASE_URL from "./config";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== Request interceptor: gắn access token =====
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== Response interceptor: tự refresh token khi 401 =====
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token found");
        }

        // GỌI ĐÚNG ENDPOINT: POST /api/v1/token/refresh/
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/token/refresh/`,
          { refresh: refreshToken },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const { access } = response.data;
        localStorage.setItem("access_token", access);

        // Retry original request với token mới
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh fail → clear storage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ================= AUTH APIs =================

export const register = async (userData) => {
  try {
    const response = await apiClient.post("/api/v1/auth/register/", userData);
    return response.data || {};
  } catch (error) {
    console.error("Register API error:", error);

    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw {
      general: error.message || "Register failed. Please try again.",
    };
  }
};

export const login = async (credentials) => {
  try {
    // Login là public, interceptor vẫn attach token nếu có nhưng không sao
    const response = await apiClient.post("/api/v1/auth/login/", credentials);

    if (response.data && response.data.tokens) {
      localStorage.setItem("access_token", response.data.tokens.access);
      localStorage.setItem("refresh_token", response.data.tokens.refresh);
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    }
    return response.data || {};
  } catch (error) {
    console.error("Login API error:", error);

    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { message: error.message || "Login failed. Please try again." };
  }
};

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      // Đúng endpoint: POST /api/v1/auth/logout/
      await apiClient.post("/api/v1/auth/logout/", { refresh: refreshToken });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};

// GET profile theo doc: GET /api/v1/user/profile/
export const getProfile = async () => {
  try {
    const response = await apiClient.get("/api/v1/user/profile/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// UPDATE profile: PUT /api/v1/user/profile/
export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put(
      "/api/v1/user/profile/",
      profileData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
export const getCurrrentUser = getCurrentUser;
export default apiClient;
