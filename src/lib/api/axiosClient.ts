import axios from 'axios';

// Create axios instance with base configuration
export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, logging, etc.
axiosClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error handling
// axiosClient.interceptors.response.use(
//   (response) => {
//     // Log successful responses in development
//     if (process.env.NODE_ENV === 'development') {
//       console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
//     }
    
//     return response;
//   },
//   (error) => {
//     // Centralized error handling
//     console.error('API Error:', error.response?.data || error.message);
    
//     // Handle specific error cases
//     if (error.response?.status === 401) {
//       // Handle unauthorized - redirect to login or refresh token
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('auth_token');
//         // You could dispatch a logout action here
//       }
//     }
    
//     if (error.response?.status === 403) {
//       // Handle forbidden - show permission error
//       console.error('Permission denied');
//     }
    
//     if (error.response?.status >= 500) {
//       // Handle server errors - show generic error message
//       console.error('Server error occurred');
//     }
    
//     return Promise.reject(error);
//   }
// );

export default axiosClient;