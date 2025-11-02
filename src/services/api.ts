import axios from 'axios';
import { toast } from "sonner";

const API_BASE_URL = 'https://giftmacvane.pythonanywhere.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



// Request Interceptor: Add Authorization token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Token ${token}`; // <-- Use 'Token', not 'Bearer'
        }
        return config;
    },
    (error) => Promise.reject(error)
);

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


export const authAPI = {
  register: (data: {
    full_name: string;
    email: string;
    phone_number: string;
    license_number: string;
    password: string;
    password2: string;
    agree_terms: string;
  }) => api.post('/user/register/', data),
  
  login: (data: { email: string; password: string }) => 
    api.post('/user/login/', data),

  logout: () => api.post('/user/logout/'),
  
  requestPasswordReset: (email: string) => 
    api.post('/user/password-reset/', { email }),
  
  confirmPasswordReset: (data: { uid: string; token: string; new_password: string; new_password2: string }) =>
    api.post('/user/password-reset-confirm/', data),
  
  verifyEmail: (data: { uid: string; token: string }) =>
    api.post('/user/verify-email/', data),
};

export const vehiclesAPI = {
  getAll: (params?: { search?: string; car_type?: string; transmission?: string; fuel_type?: string; min_price?: string; max_price?: string }) =>
    api.get('/vehicles/', { params }),

  // Fetch by slug instead of numeric ID
  getBySlug: (slug: string) => api.get(`/vehicles/${slug}/`),

  // Create remains the same
  create: (data: FormData) => api.post('/vehicles/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  // Update by slug
  update: (slug: string, data: FormData) => api.put(`/vehicles/${slug}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  // Delete by slug
  delete: (slug: string) => api.delete(`/vehicles/${slug}/`),
};


export const bookingsAPI = {
  create: (data: { vehicle: number; start_date: string; end_date: string }) =>
    api.post('/bookings/', data), 
  getMyBookings: () => api.get('/my-bookings/'),
  getAllBookings: () => api.get('/all-bookings/'),
  updateStatus: (id: number, status: string) => 
    api.put(`/bookings/${id}/status/`, { status }),
  delete: (id:number) => 
    api.delete(`/bookings/${id}/delete/`),
};

export const userAPI = {
  getProfile: () => api.get('/user/me/'),
  changePassword: (data: { old_password: string; new_password: string; new_password2: string }) =>
    api.post('/user/change-password/', data),
  getCustomerList: () => api.get('/user/customer-list/'),
};

export const damageReportAPI = {
  create: (data: { booking: number; description: string; images?: File[] }) => {
    const formData = new FormData();
    formData.append('booking', data.booking.toString());
    formData.append('description', data.description);
    if (data.images) {
      data.images.forEach((img) => formData.append('images', img));
    }
    return api.post('/damage-reports/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  // Customer-specific: get all reports submitted by the logged-in user
  getMyReports: () => api.get('/damage-reports/'),
  getAll: () => api.get('/admin/damage-reports/'),
  getById: (id: number) => api.get(`/admin/damage-reports/${id}/`),
  updateStatus: (id: number, status: string) => 
    api.patch(`/admin/damage-reports/${id}/`, { status }),
};

export const statsAPI = {
  getOverview: () => api.get('/admin/stats/overview/'),
};

export const locationsAPI = {
  getAll: () => api.get('/locations/'),
  create: (data: { name: string; address: string; city: string }) => 
    api.post('/locations/new/', data),
  update: (id: number, data: { name: string; address: string; city: string }) => 
    api.put(`/locations/${id}/update/`, data),
  delete: (id: number) => api.delete(`/locations/${id}/delete/`),
};

export default api;
