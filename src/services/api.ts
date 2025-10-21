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
    config.headers.Authorization = `Bearer ${token}`;
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
  getAll: () => api.get('/vehicles/'),
  getById: (id: string) => api.get(`/vehicles/${id}/`),
  create: (data: FormData) => api.post('/vehicles/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export const bookingsAPI = {
  create: (data: { vehicle: number; start_date: string; end_date: string }) =>
    api.post('/bookings/', data),
  getMyBookings: () => api.get('/my-bookings/'),
};

export default api;
