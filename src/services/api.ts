import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "https://giftmacvane.pythonanywhere.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// -----------------------------
// REQUEST INTERCEPTOR
// -----------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// RESPONSE INTERCEPTOR
// -----------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;
    const token = localStorage.getItem("token");

    if (status === 401) {
      if (token && detail === "Invalid token.") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Session expired. Please login again.");
        window.location.href = "/auth";
      } else if (!token && detail === "Authentication credentials were not provided.") {
        toast.error("Authentication required. Please login.");
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }
);

// ==========================================================
// AUTHENTICATION API (Aligned with updated Django backend)
// ==========================================================
export const authAPI = {
  /** Register user — backend auto-activates (no email verification) */
  register: (data) =>
    api.post("/user/register/", data),

  /** Login */
  login: (data) =>
    api.post("/user/login/", data),

  /** Logout */
  logout: () =>
    api.post("/user/logout/"),

  /** Request password reset email */
  requestPasswordReset: (email) =>
    api.post("/user/password-reset-request/", { email }),

  /** Confirm password reset */
  confirmPasswordReset: (data) =>
    api.post("/user/password-reset-confirm/", data),
};

// ==========================================================
// USER API
// ==========================================================
export const userAPI = {
  /** Get logged-in user details */
  getProfile: () => api.get("/user/me/"),

  /** Change password */
  changePassword: (data) =>
    api.post("/user/change-password/", data),

  /** Admin: list all customers */
  getCustomerList: () => api.get("/user/customer-list/"),
};

// ==========================================================
// VEHICLES API
// ==========================================================
export const vehiclesAPI = {
  getAll: (params) => api.get("/vehicles/", { params }),
  getBySlug: (slug) => api.get(`/vehicles/${slug}/`),
  create: (data) =>
    api.post("/vehicles/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (slug, data) =>
    api.put(`/vehicles/${slug}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (slug) => api.delete(`/vehicles/${slug}/`),
};

// ==========================================================
// BOOKINGS API
// ==========================================================
export const bookingsAPI = {
  create: (data) => api.post("/bookings/", data),
  getMyBookings: () => api.get("/my-bookings/"),
  getAllBookings: () => api.get("/all-bookings/"),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status/`, { status }),
  delete: (id) => api.delete(`/bookings/${id}/delete/`),
};

// ==========================================================
// DAMAGE REPORT API
// ==========================================================
export const damageReportAPI = {
  create: (data) => {
    const formData = new FormData();
    formData.append("booking", data.booking.toString());
    formData.append("description", data.description);
    if (data.images) {
      data.images.forEach((img) => formData.append("images", img));
    }
    return api.post("/damage-reports/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getMyReports: () => api.get("/damage-reports/"),
  getAll: () => api.get("/admin/damage-reports/"),
  getById: (id) => api.get(`/admin/damage-reports/${id}/`),
  updateStatus: (id, status) => api.patch(`/admin/damage-reports/${id}/`, { status }),
};

// ==========================================================
// ADMIN STATS API
// ==========================================================
export const statsAPI = {
  getOverview: () => api.get("/admin/stats/overview/"),
};

// ==========================================================
// LOCATIONS API
// ==========================================================
export const locationsAPI = {
  getAll: () => api.get("/locations/"),
  create: (data) => api.post("/locations/new/", data),
  update: (id, data) => api.put(`/locations/${id}/update/`, data),
  delete: (id) => api.delete(`/locations/${id}/delete/`),
};

export default api;
