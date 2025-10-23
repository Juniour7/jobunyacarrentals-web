import axios from 'axios';

const API_BASE_URL = 'https://giftmacvane.pythonanywhere.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

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
};

export const vehiclesAPI = {
  getAll: (params?: { search?: string; car_type?: string; transmission?: string; fuel_type?: string }) =>
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
    api.patch(`/bookings/${id}/status/`, { status }),
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
  getAll: () => api.get('/admin/damage-reports/'),
  getById: (id: number) => api.get(`/admin/damage-reports/${id}/`),
  updateStatus: (id: number, status: string) => 
    api.patch(`/admin/damage-reports/${id}/`, { status }),
};

export const statsAPI = {
  getOverview: () => api.get('/admin/stats/overview/'),
};

export default api;
