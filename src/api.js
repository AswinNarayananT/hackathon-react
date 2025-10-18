import axios from "axios";
import { store } from "./redux/store";
import { logout } from "./redux/auth/authThunks";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
});

console.log("API Base URL:", import.meta.env.VITE_API_URL);

api.interceptors.request.use((config) => {
  console.log("Request sent to:", config.baseURL + config.url);
  
  // Add access token to Authorization header if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Only attempt token refresh if:
    // 1. Response is 401 (Unauthorized)
    // 2. We haven't already tried to refresh for this request
    // 3. The failing request is not the token refresh endpoint itself
    // 4. The failing request is not login/register (they don't need tokens)
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('/token-refresh/') &&
      !originalRequest.url.includes('/custom-login/') &&
      !originalRequest.url.includes('/custom-register/')
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the access token using the refresh token cookie
        const refreshResponse = await api.post('/users/token-refresh/');

        if (refreshResponse.status === 200 && refreshResponse.data.access) {
          // Update access token in localStorage
          const newAccessToken = refreshResponse.data.access;
          localStorage.setItem('token', newAccessToken);
          
          // Retry the original request with new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - either refresh token is invalid/expired or missing
        console.log("Token refresh failed, logging out");
        localStorage.removeItem("token");
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    
    // For all other errors or if token refresh was already attempted, reject
    return Promise.reject(error);
  }
);

export default api;
