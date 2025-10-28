import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Sites API
export const sitesAPI = {
  getSites: () => api.get('/sites'),
  
  getSite: (id: number) => api.get(`/sites/${id}`),
  
  createSite: (data: {
    title: string;
    siteUrl: string;
    category: string;
    coverImage?: string;
  }) => api.post('/sites', data),
  
  updateSite: (id: number, data: {
    title?: string;
    siteUrl?: string;
    category?: string;
    coverImage?: string;
  }) => api.put(`/sites/${id}`, data),
  
  deleteSite: (id: number) => api.delete(`/sites/${id}`),
  
  uploadImage: (formData: FormData) => 
    api.post('/sites/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  createSiteWithImage: (formData: FormData) =>
    api.post('/sites/with-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  updateSiteWithImage: (id: number, formData: FormData) =>
    api.put(`/sites/${id}/with-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export default api;
